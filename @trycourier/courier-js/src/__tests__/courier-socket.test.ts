import { CourierClientOptions } from "../client/courier-client";
import { CourierSocket } from "../socket/courier-socket";
import { CourierApiUrls } from "../types/courier-api-urls";
import { ServerMessage, ServerResponse } from "../types/socket/protocol/v1/messages";
import { Logger } from "../utils/logger";
import { Server } from "mock-socket";

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

let mockServer: Server;

describe('CourierSocket', () => {

  beforeEach(() => {
    mockServer = new Server(WEB_SOCKET_URL);

    jest.clearAllMocks();
  });

  afterEach(() => {
    mockServer.stop();
  });

  describe('connect', () => {
    it('should connect to the server', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      socket.connect();

      await connectionOpened(mockServer);

      expect(socket.isOpen).toBe(true);
    });
  });

  describe('message listener', () => {
    it('should call the onMessageReceived callback when a message is received', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onMessageReceivedSpy = jest.spyOn(socket, 'onMessageReceived')
          .mockImplementation(() => Promise.resolve());

      socket.connect();
      await connectionOpened(mockServer);

      mockServer.emit('message', JSON.stringify({
        tid: TEST_TID,
        response: ServerResponse.Ack,
      }));

      expect(onMessageReceivedSpy).toHaveBeenCalledWith({
        tid: TEST_TID,
        response: ServerResponse.Ack,
      });
    });

    // mock-socket doesn't work well with fake timers, so we need to wait for the actual retry-after (1s)
    it('should close and retry the connection when the server sends \'reconnect\'', async () => {
      const retryAfterSeconds = 1;
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onMessageReceivedSpy = jest.spyOn(socket, 'onMessageReceived')
          .mockImplementation(() => Promise.resolve())

      socket.connect();
      await connectionOpened(mockServer);

      mockServer.emit('message', JSON.stringify({
        event: 'reconnect',
        retryAfter: retryAfterSeconds,
        code: 1012,
        message: 'Server is going away!',
      }));

      expect(onMessageReceivedSpy).not.toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      // Wait for the reconnect
      await connectionOpened(mockServer);

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
      await connectionOpened(mockServer);

      mockServer.close();

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);
      expect(mockServer.clients.length).toBe(0);
    });

    // mock-socket doesn't work well with fake timers, so we need to wait for the actual retry-after (5s)
    it('should retry the connection for a non-normal closure and respect the Retry-After reason', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
          .mockImplementation(() =>
            Promise.resolve());

      // Connect to the server
      socket.connect();
      await connectionOpened(mockServer);

      // Close the connection with a non-normal closure code
      mockServer.close({ code: 1012, reason: '{"Retry-After": "5"}', wasClean: false });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      // Reset the mock server and wait for a connection
      mockServer = new Server(WEB_SOCKET_URL);
      await connectionOpened(mockServer);

      expect(socket.isOpen).toBe(true);
    }, 10_000);

    // mock-socket doesn't work well with fake timers, so we need to wait for the actual retry interval (15-45s)
    it('should retry the connection for a non-normal closure and use the default retry interval', async () => {
      const socket = new CourierSocketTestImplementation(OPTIONS);
      const onCloseSpy = jest.spyOn(socket, 'onClose')
          .mockImplementation(() =>
            Promise.resolve());

      // Connect to the server
      socket.connect();
      await connectionOpened(mockServer);

      // Close the connection with a non-normal closure code
      mockServer.close({ code: 1012, reason: 'Server is going away!', wasClean: false });

      expect(onCloseSpy).toHaveBeenCalled();
      expect(socket.isOpen).toBe(false);

      // Reset the mock server and wait for a connection
      mockServer = new Server(WEB_SOCKET_URL);
      await connectionOpened(mockServer);

      expect(socket.isOpen).toBe(true);
    }, 60_000);
  });
});

function connectionOpened(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.on('connection', (_) => {
      resolve();
    });
  });
}

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