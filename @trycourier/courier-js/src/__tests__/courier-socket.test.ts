import { CourierClientOptions } from "../client/courier-client";
import { CourierSocket } from "../socket/courier-socket";
import { CourierApiUrls } from "../types/courier-api-urls";
import { ServerMessage, ServerResponse } from "../types/socket/protocol/v1/messages";
import { Logger } from "../utils/logger";
import WebSocketServer from "jest-websocket-mock";

const WEB_SOCKET_URL = 'ws://localhost:8080';

// Override the backoff intervals and max retry attempts.
// Fake timers don't work well with jest-websocket-mock,
// since the underlying mock-socket calls setTimeout frequently.
const BACKOFF_INTERVALS_IN_MILLIS = [1000, 2000];
const MAX_RETRY_ATTEMPTS = 2;

// Override the server Retry-After.
const SERVER_RETRY_AFTER_SECONDS = 0.5;

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

let mockServer: WebSocketServer;

describe('CourierSocket', () => {
  beforeEach(() => {
    (CourierSocket as any).BACKOFF_INTERVALS_IN_MILLIS = BACKOFF_INTERVALS_IN_MILLIS;
    (CourierSocket as any).MAX_RETRY_ATTEMPTS = MAX_RETRY_ATTEMPTS;

    mockServer = new WebSocketServer(WEB_SOCKET_URL, { jsonProtocol: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockServer.close();
  });

  describe('connect', () => {
    it('should connect to the server', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      socket.connect();

      await mockServer.connected;

      expect(socket.isOpen).toBe(true);
    });
  });

  describe('message listener', () => {
    it('should call the onMessageReceived callback when a message is received', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onMessageReceivedSpy = jest.spyOn(socket, 'onMessageReceived')
          .mockImplementation(() => Promise.resolve());

      socket.connect();
      await mockServer.connected;

      mockServer.send({
        tid: TEST_TID,
        response: ServerResponse.Ack,
      });

      expect(onMessageReceivedSpy).toHaveBeenCalledWith({
        tid: TEST_TID,
        response: ServerResponse.Ack,
      });
    });

    it('should close and retry the connection when the server sends \'reconnect\'', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onMessageReceivedSpy = jest.spyOn(socket, 'onMessageReceived')
          .mockImplementation(() => Promise.resolve())

      socket.connect();
      await mockServer.connected;

      mockServer.send({
        event: 'reconnect',
        retryAfter: SERVER_RETRY_AFTER_SECONDS,
        code: 1012,
        message: 'Server is going away!',
      });

      expect(onMessageReceivedSpy).not.toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      // Wait for the retry-after to expire
      await new Promise((resolve) => setTimeout(resolve, 2 * SERVER_RETRY_AFTER_SECONDS * 1000));

      // Wait for the reconnect
      await mockServer.connected;
      expect(socket.isOpen).toBe(true);
    });
  });

  describe('close listener', () => {
    it('should not retry the connection for a normal closure', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
          .mockImplementation(() =>
            Promise.resolve());

      socket.connect();
      await mockServer.connected;

      mockServer.close({ code: 1000, reason: 'Normal closure', wasClean: true });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);
      expect(mockServer.closed).resolves.toBeUndefined();
    });

    it('should retry the connection for a non-normal closure and respect the Retry-After reason', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
          .mockImplementation(() =>
            Promise.resolve());

      // Connect to the server
      socket.connect();
      await mockServer.connected;

      // Close the connection with a non-normal closure code
      mockServer.close({ code: 1012, reason: `{"Retry-After": "${SERVER_RETRY_AFTER_SECONDS}"}`, wasClean: false });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      // Reset the mock server and wait for a connection
      mockServer = new WebSocketServer(WEB_SOCKET_URL, { jsonProtocol: true });
      await mockServer.connected;
      expect(socket.isOpen).toBe(true);
    });

    it('should retry the connection for a non-normal closure and use the default retry interval', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
          .mockImplementation(() =>
            Promise.resolve());

      // Connect to the server
      socket.connect();
      await mockServer.connected;

      // Close the connection with a non-normal closure code
      mockServer.close({ code: 1012, reason: 'Server is going away!', wasClean: false });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      // Reset the mock server and wait for a connection
      mockServer = new WebSocketServer(WEB_SOCKET_URL, { jsonProtocol: true });
      await mockServer.connected;

      expect(socket.isOpen).toBe(true);
    });
  });
});

class CourierSocketTestImplementation extends CourierSocket {
  public onOpen(_: Event): Promise<void> {
    return Promise.resolve();
  }
  public onMessageReceived(_: ServerMessage): Promise<void> {
    return Promise.resolve();
  }
  public onClose(_: CloseEvent): Promise<void> {
    return Promise.resolve();
  }
  public onError(_: Event): Promise<void> {
    return Promise.resolve();
  }
}
