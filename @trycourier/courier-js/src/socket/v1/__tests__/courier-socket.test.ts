import { CourierClientOptions } from "../../../client/courier-client";
import { CourierApiUrls } from "../../../types/courier-api-urls";
import { ServerActionEnvelope, MessageEventEnvelope, ServerAction } from "../../../types/socket/protocol/v1/messages";
import { Logger } from "../../../utils/logger";
import { CourierSocket } from "../courier-socket";
import WebSocketServer from 'jest-websocket-mock';

const WEB_SOCKET_URL = 'ws://localhost:8080';

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

const TEST_TID = 'test-abcd-1234';

jest.useFakeTimers({ legacyFakeTimers: false });

describe('CourierSocket', () => {
  let server: WebSocketServer;

  beforeEach(() => {
    server = new WebSocketServer(WEB_SOCKET_URL, { jsonProtocol: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  describe('connect', () => {
    it('should connect to the server', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);

      await socket.connect();
      await server.connected;

      expect(socket.isOpen).toBe(true);
    });

    it('should not retry if the connection is already open', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);

      await socket.connect();
      await server.connected;

      expect(socket.isOpen).toBe(true);

      // Trying to connect again should throw an error
      expect(socket.connect()).rejects.toThrow('WebSocket connection already exists');
    });

    describe('message listener', () => {
      it('should call the onMessageReceived listener when a message is received', async () => {
        const socket = new CourierSocketTestImplementation(OPTIONS);
        const onMessageReceivedSpy = jest.spyOn(socket, 'onMessageReceived')
          .mockImplementation(() => Promise.resolve());

        await socket.connect();
        await server.connected;

        server.send({
          tid: TEST_TID,
          action: ServerAction.Ack,
        });

        expect(onMessageReceivedSpy).toHaveBeenCalledWith({
          tid: TEST_TID,
          action: ServerAction.Ack,
        });
      });

      it('should close and retry the connection when the server sends a reconnect message', async () => {
        const socket = new CourierSocketTestImplementation(OPTIONS);
        const retryAfterSeconds = 10;
        const onMessageReceivedSpy = jest.spyOn(socket, 'onMessageReceived')
          .mockImplementation(() => Promise.resolve());

        await socket.connect();
        await server.connected;

        jest.runOnlyPendingTimers();
        jest.runAllTicks();
        console.log('before send');

        server.send({
          event: 'reconnect',
          retryAfter: retryAfterSeconds,
          code: 1012,
          message: 'Server is going away!',
        });

        jest.runOnlyPendingTimers();

        expect(onMessageReceivedSpy).not.toHaveBeenCalledTimes(1);
        // expect(closeSpy).toHaveBeenCalledTimes(1);
        expect(server.closed).resolves.toBeUndefined();

        jest.runOnlyPendingTimers();

        // jest.runAllTicks();
        // jest.advanceTimersByTime(retryAfterSeconds * 1000);
        await Promise.resolve();
        await server.connected;

        expect(socket.isOpen).toBe(true);

        // expect(socket.isConnecting).toBe(true);
        // expect(socket.isOpen).toBe(false);

        // await server.connected;

        // expect(socket.isConnecting).toBe(false);
        // expect(socket.isOpen).toBe(true);
      }, 10000);
    });
  });
});

class CourierSocketTestImplementation extends CourierSocket {
  public onOpen(_: Event): Promise<void> {
    return Promise.resolve();
  }
  public onMessageReceived(_: ServerActionEnvelope | MessageEventEnvelope): Promise<void> {
    return Promise.resolve();
  }
  public onClose(_: CloseEvent): Promise<void> {
    return Promise.resolve();
  }
  public onError(_: Event): Promise<void> {
    return Promise.resolve();
  }
}
