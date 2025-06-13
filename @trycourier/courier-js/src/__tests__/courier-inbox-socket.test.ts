import { CourierClientOptions } from "../client/courier-client";
import { CourierInboxSocket } from "../socket/courier-inbox-socket";
import { Logger } from "../utils/logger";
import { CourierApiUrls } from "../types/courier-api-urls";
import WebSocketServer from "jest-websocket-mock";
import { ClientAction, ConfigResponseEnvelope, InboxMessageEvent, InboxMessageEventEnvelope, ServerAction, ServerActionEnvelope, ServerResponse } from "../types/socket/protocol/v1/messages";
import { UUID } from "../utils/uuid";

const nanoidSpy = jest.spyOn(UUID, 'nanoid');

const WEB_SOCKET_URL = 'ws://localhost:8080';

// Override the ping intervals to make the tests run faster.
// Fake timers don't work well with jest-websocket-mock,
// since the underlying socket-mock calls setTimeout frequently.
const PING_INTERVAL_MILLIS = 250;
const SERVER_PING_INTERVAL_SECONDS = 0.5;

const API_URLS: CourierApiUrls = {
  inbox: {
    webSocket: WEB_SOCKET_URL,
    graphql: '',
  },
  courier: {
    rest: '',
    graphql: '',
  }
};

const OPTIONS: CourierClientOptions = {
  accessToken: 'test',
  connectionId: 'test',
  userId: 'test',
  logger: new Logger(false),
  apiUrls: API_URLS,
};

const TID_1 = 'test-tid-1';
const TID_2 = 'test-tid-2';
const TID_3 = 'test-tid-3';
const TID_4 = 'test-tid-4';

let mockServer: WebSocketServer;

describe('CourierInboxSocket', () => {
  beforeEach(() => {
    mockServer = new WebSocketServer(WEB_SOCKET_URL, { jsonProtocol: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockServer.close();
  });

  describe('onOpen', () => {
    it('should send get-config and subscribe requests', async () => {
      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;

      expect(socket.isOpen).toBe(true);

      await expect(mockServer).toReceiveMessage({
        action: 'get-config',
        tid: expect.any(String),
      });

      await expect(mockServer).toReceiveMessage({
        action: 'subscribe',
        tid: expect.any(String),
        data: {
          channel: 'test',
          event: '*',
        },
      });
    });
  });

  describe('onMessageReceived', () => {
    it('should send a pong response to a ping action', async () => {
      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      const ping: ServerActionEnvelope = {
        action: ServerAction.Ping,
        tid: TID_1,
      };
      mockServer.send(ping);

      await expect(mockServer).toReceiveMessage({
        action: ClientAction.Pong,
        tid: TID_1,
      });
    });

    it('should set and use ping interval from the server', async () => {
      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      const response: ConfigResponseEnvelope = {
        response: 'config',
        tid: expect.any(String),
        data: {
          pingInterval: SERVER_PING_INTERVAL_SECONDS,
          maxOutstandingPings: 3,
        },
      };
      mockServer.send(response);

      await new Promise((resolve) => setTimeout(resolve, SERVER_PING_INTERVAL_SECONDS * 1000));

      // expect(...).toReceiveMessage() expects the message to be received within 1000ms.
      // https://www.npmjs.com/package/jest-websocket-mock#run-assertions-on-received-messages
      await expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: expect.any(String),
      });
    });

    it('should call message event listeners when an inbox message event is received', async () => {
      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      const listener = jest.fn();
      const listener2 = jest.fn();
      socket.addMessageEventListener(listener);
      socket.addMessageEventListener(listener2);

      const messageEvent: InboxMessageEventEnvelope = {
        event: InboxMessageEvent.NewMessage,
        data: {
          messageId: 'test-message-id',
          data: {
            test: 'test-data',
          },
        },
      };
      mockServer.send(messageEvent);

      const messageEventWithCreatedTime = {
        ...messageEvent,
        data: {
          ...messageEvent.data,
          created: expect.any(String),
        },
      };

      expect(listener).toHaveBeenCalledWith(messageEventWithCreatedTime);
      expect(listener2).toHaveBeenCalledWith(messageEventWithCreatedTime);
    });
  });

  describe('ping/pong behavior', () => {
    it('should send a ping request on the default interval after the connection is opened', async () => {
      (CourierInboxSocket as any)['DEFAULT_PING_INTERVAL_MILLIS'] = PING_INTERVAL_MILLIS;

      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      // Wait for the ping to be sent
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));

      await expect(mockServer).toReceiveMessage({
        action: 'ping',
        tid: expect.any(String),
      });
    });

    it('should close the connection if the default max outstanding pings is reached', async () => {
      (CourierInboxSocket as any)['DEFAULT_PING_INTERVAL_MILLIS'] = PING_INTERVAL_MILLIS;
      (CourierInboxSocket as any)['DEFAULT_MAX_OUTSTANDING_PINGS'] = 1;

      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      // Wait for the first ping to be sent
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));
      expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: expect.any(String),
      });

      // Wait until we're ready to send the second ping and assert the connection closes
      // since max outstanding pings has been reached.
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));
      expect(socket.isOpen).toBe(false);
      expect(mockServer.closed).resolves.toBeUndefined();
    });

    it('should close the connection if the server-configured max outstanding pings is reached', async () => {
      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      const response: ConfigResponseEnvelope = {
        response: 'config',
        tid: expect.any(String),
        data: {
          pingInterval: SERVER_PING_INTERVAL_SECONDS,
          maxOutstandingPings: 1,
        },
      };
      mockServer.send(response);

      await new Promise((resolve) => setTimeout(resolve, SERVER_PING_INTERVAL_SECONDS * 1000));
      expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: expect.any(String),
      });

      // Wait until we're ready to send the second ping and assert the connection closes
      // since max outstanding pings has been reached.
      await new Promise((resolve) => setTimeout(resolve, SERVER_PING_INTERVAL_SECONDS * 1000));
      expect(socket.isOpen).toBe(false);
      expect(mockServer.closed).resolves.toBeUndefined();
    });

    it('should reset outstanding pings when a pong is received', async () => {
      (CourierInboxSocket as any)['DEFAULT_PING_INTERVAL_MILLIS'] = PING_INTERVAL_MILLIS;
      (CourierInboxSocket as any)['DEFAULT_MAX_OUTSTANDING_PINGS'] = 2;

      const socket = new CourierInboxSocket(OPTIONS);

      socket.connect();
      await mockServer.connected;
      await expectOpeningMessages(mockServer);

      // Ping #1 received (but not responded to)
      // Mock nanoid just before it's called (and for all subsequent calls)
      // since other methods will use nanoid between these calls.
      nanoidSpy.mockReturnValue(TID_1);
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));
      expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: TID_1,
      });

      // Ping #2 received
      nanoidSpy.mockReturnValue(TID_2);
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));
      expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: TID_2,
      });

      // Respond to ping #2 (resets outstanding pings)
      mockServer.send({
        response: ServerResponse.Pong,
        tid: TID_2,
      });

      // Ping #3 received (but not responded to)
      nanoidSpy.mockReturnValue(TID_3);
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));
      expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: TID_3,
      });

      // Ping #4 received (but not responded to)
      // Socket didn't close since there's only been one missed ping (#3) since the last pong (#2).
      nanoidSpy.mockReturnValue(TID_4);
      await new Promise((resolve) => setTimeout(resolve, PING_INTERVAL_MILLIS));
      expect(mockServer).toReceiveMessage({
        action: ClientAction.Ping,
        tid: TID_4,
      });

      // Respond to ping #4
      mockServer.send({
        response: ServerResponse.Pong,
        tid: TID_4,
      });

      expect(socket.isOpen).toBe(true);
    });
  });
});

/** Messages sent by the client when the connection is opened. */
async function expectOpeningMessages(server: WebSocketServer): Promise<void> {
  await expect(server).toReceiveMessage(expect.objectContaining({ action: 'get-config' }));
  await expect(server).toReceiveMessage(expect.objectContaining({ action: 'subscribe' }));
}
