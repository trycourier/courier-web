import { CourierClientOptions } from "../client/courier-client";
import { CourierSocket } from "../socket/courier-socket";
import { CourierApiUrls } from "../types/courier-api-urls";
import { ServerMessage, ServerResponse } from "../types/socket/protocol/messages";
import { CourierUserAgent } from "../utils/courier-user-agent";
import { Logger } from "../utils/logger";
import WebSocketServer from "jest-websocket-mock";

const WEB_SOCKET_URL = 'ws://localhost:8080';

// Override the backoff intervals and max retry attempts.
// Fake timers don't work well with jest-websocket-mock,
// since the underlying mock-socket calls setTimeout frequently.
const BACKOFF_INTERVALS_IN_MILLIS = [1000, 2000];
const MAX_RETRY_ATTEMPTS = 2;
const BACKOFF_JITTER_FACTOR = 0.5;

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

const CONNECTION_ID = 'test';
const USER_AGENT_CLIENT_NAME = "test-sdk";
const USER_AGENT_CLIENT_VERSION = "test-sdk-version";

const courierUserAgent = new CourierUserAgent(
  CONNECTION_ID,
  USER_AGENT_CLIENT_NAME,
  USER_AGENT_CLIENT_VERSION
);

const OPTIONS: CourierClientOptions = {
  accessToken: 'test',
  connectionId: 'test',
  userId: 'test',
  logger: new Logger(false),
  apiUrls: API_URLS,
  courierUserAgent,
};

const TEST_TID = 'test-abcd-1234';

let mockServer: WebSocketServer;

describe('CourierSocket', () => {
  beforeEach(() => {
    (CourierSocket as any).BACKOFF_INTERVALS_IN_MILLIS = BACKOFF_INTERVALS_IN_MILLIS;
    (CourierSocket as any).MAX_RETRY_ATTEMPTS = MAX_RETRY_ATTEMPTS;
    (CourierSocket as any).BACKOFF_JITTER_FACTOR = BACKOFF_JITTER_FACTOR;

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

    it('should not connect if the connection is already established', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);

      // Count the number of connections to the mock server
      let connectionCount = 0;
      mockServer.on('connection', (_) => {
        connectionCount++;
      });

      socket.connect();
      await mockServer.connected;

      // Call connect again, which should be a no-op
      socket.connect();

      expect(connectionCount).toBe(1);
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

      // Wait for the Retry-After to expire
      await new Promise((resolve) => setTimeout(resolve, 2 * SERVER_RETRY_AFTER_SECONDS * 1000));

      // Wait for the reconnect to happen
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
      const connectSpy = jest.spyOn(socket, 'connect');

      socket.connect();
      await mockServer.connected;

      mockServer.close({ code: 1000, reason: 'Normal closure', wasClean: true });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);
      expect(mockServer.closed).resolves.toBeUndefined();

      // Wait for the retry interval to pass (accounting for 1.5x jitter) and verify no new connection attempts are made
      // (only 1 initial connection attempt)
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_INTERVALS_IN_MILLIS[0] * 1.5));
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should not retry the connection if the close event was requested by the application', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
        .mockImplementation(() =>
          Promise.resolve());
      const connectSpy = jest.spyOn(socket, 'connect');

      socket.connect();
      await mockServer.connected;

      socket.close();
      await mockServer.closed;

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);
      expect(mockServer.closed).resolves.toBeUndefined();

      // Wait for the retry interval to pass (accounting for 1.5x jitter) and verify no new connection attempts are made
      // (only 1 initial connection attempt)
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_INTERVALS_IN_MILLIS[0] * 1.5));
      expect(connectSpy).toHaveBeenCalledTimes(1);
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

    it('should stop retrying the connection after the max retry attempts', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
        .mockImplementation(() =>
          Promise.resolve());
      const connectSpy = jest.spyOn(socket, 'connect');

      // Connect to the server
      await socket.connect();
      await mockServer.connected;

      // Close the connection with a non-normal closure code, and don't restart the server
      mockServer.close({ code: 1012, reason: 'Server is going away!', wasClean: false });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      const totalBackoffTimeInMillis = BACKOFF_INTERVALS_IN_MILLIS.reduce((acc, curr) => acc + curr, 0);

      // Wait for the max retry attempts (1.5x to account for potential jitter)
      await new Promise((resolve) => setTimeout(resolve, totalBackoffTimeInMillis * 1.5));

      // 1 initial connection + 2 retries
      expect(connectSpy).toHaveBeenCalledTimes(MAX_RETRY_ATTEMPTS + 1);
      expect(socket.isOpen).toBe(false);
    });

    it('should retry within the backoff interval with jitter', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const connectSpy = jest.spyOn(socket, 'connect');
      const onCloseSpy = jest.spyOn(socket, 'onClose')
        .mockImplementation(() =>
          Promise.resolve());

      // Connect to the server
      socket.connect();
      await mockServer.connected;

      // Close the connection with a non-normal closure code
      mockServer.close({ code: 1012, reason: 'Server is going away!', wasClean: false });

      // The backoff interval starts when close is called
      expect(onCloseSpy).toHaveBeenCalled();
      const disconnectTime = Date.now();

      expect(socket.isOpen).toBe(false);

      // Reset the mock server and wait for a connection
      mockServer = new WebSocketServer(WEB_SOCKET_URL, { jsonProtocol: true });
      await mockServer.connected;

      // The backoff interval ends when connect is called again
      expect(connectSpy).toHaveBeenCalledTimes(2);
      const reconnectTime = Date.now();

      // The reconnect time should be within the backoff interval with jitter
      expect(reconnectTime - disconnectTime).toBeGreaterThan(BACKOFF_JITTER_FACTOR * BACKOFF_INTERVALS_IN_MILLIS[0]);
      expect(reconnectTime - disconnectTime).toBeLessThan((1 + BACKOFF_JITTER_FACTOR) * BACKOFF_INTERVALS_IN_MILLIS[0]);

      expect(socket.isOpen).toBe(true);
    });
  });

  describe('error listener', () => {
    it('should not retry the connection on error event if the close was requested by the client', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onErrorSpy = jest.spyOn(socket, 'onError')
        .mockImplementation(() =>
          Promise.resolve());
      const connectSpy = jest.spyOn(socket, 'connect');

      socket.connect();
      await mockServer.connected;

      // Client requests a close
      socket.close();

      // Simulate an error event from the server immediately after the client requests a close
      mockServer.error();

      expect(onErrorSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);
      expect(mockServer.closed).resolves.toBeUndefined();

      // Wait for the retry interval to pass (accounting for 1.5x jitter) and verify no new connection attempts are made
      // (only 1 initial connection attempt)
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_INTERVALS_IN_MILLIS[0] * 1.5));
      expect(connectSpy).toHaveBeenCalledTimes(1);
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
