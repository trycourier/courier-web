import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierToastDatastore } from "../toast-datastore";
import { CourierToastDatastoreListener } from "../toast-datastore-listener";

const createMockMessage = (messageId: string, overrides?: Partial<InboxMessage>): InboxMessage => ({
  messageId,
  title: `Test Message ${messageId}`,
  body: 'Test body',
  created: new Date().toISOString(),
  read: false,
  archived: false,
  tags: [],
  ...overrides,
} as InboxMessage);

describe('CourierToastDatastore', () => {
  let datastore: CourierToastDatastore;

  // Test constants
  const LISTENER_COUNT = 3;
  const STACK_TOP = 0;

  beforeEach(() => {
    // Reset singleton instance before each test
    (CourierToastDatastore as any).instance = undefined;
    datastore = CourierToastDatastore.shared;
  });

  afterEach(() => {
    // Destroy singleton instance after each test
    (CourierToastDatastore as any).instance = undefined;
    jest.clearAllMocks();
  });

  describe('shared', () => {
    it('should return a singleton instance', () => {
      const instance1 = CourierToastDatastore.shared;
      const instance2 = CourierToastDatastore.shared;

      expect(instance1).toBe(instance2);
    });

    it('should create instance on first access', () => {
      (CourierToastDatastore as any).instance = undefined;

      const instance = CourierToastDatastore.shared;

      expect(instance).toBeInstanceOf(CourierToastDatastore);
    });
  });

  describe('addDatastoreListener', () => {
    it('should maintain multiple listeners in order', () => {
      const listener1 = new CourierToastDatastoreListener({});
      const listener2 = new CourierToastDatastoreListener({});
      const listener3 = new CourierToastDatastoreListener({});

      datastore.addDatastoreListener(listener1);
      datastore.addDatastoreListener(listener2);
      datastore.addDatastoreListener(listener3);

      const listeners = (datastore as any)._datastoreListeners;
      expect(listeners).toHaveLength(LISTENER_COUNT);
      expect(listeners).toEqual([listener1, listener2, listener3]);
    });
  });

  describe('removeDatastoreListener', () => {
    it('should remove a specific listener from the datastore', () => {
      const listener1 = new CourierToastDatastoreListener({});
      const listener2 = new CourierToastDatastoreListener({});
      const listener3 = new CourierToastDatastoreListener({});

      datastore.addDatastoreListener(listener1);
      datastore.addDatastoreListener(listener2);
      datastore.addDatastoreListener(listener3);

      datastore.removeDatastoreListener(listener2);

      const listeners = (datastore as any)._datastoreListeners;
      expect(listeners).toHaveLength(2);
      expect(listeners).toContain(listener1);
      expect(listeners).toContain(listener3);
      expect(listeners).not.toContain(listener2);
    });

    it('should not error when removing non-existent listener', () => {
      const listener1 = new CourierToastDatastoreListener({});
      const listener2 = new CourierToastDatastoreListener({});

      datastore.addDatastoreListener(listener1);

      expect(() => {
        datastore.removeDatastoreListener(listener2);
      }).not.toThrow();

      const listeners = (datastore as any)._datastoreListeners;
      expect(listeners).toHaveLength(1);
      expect(listeners[0]).toBe(listener1);
    });

    it('should handle removing from empty listeners array', () => {
      const listener = new CourierToastDatastoreListener({});

      expect(() => {
        datastore.removeDatastoreListener(listener);
      }).not.toThrow();

      const listeners = (datastore as any)._datastoreListeners;
      expect(listeners).toHaveLength(0);
    });
  });

  describe('addMessage', () => {
    it('should add a message to the dataset', () => {
      const message = createMockMessage('msg-1');

      datastore.addMessage(message);

      const dataset = (datastore as any)._dataset;
      expect(dataset).toHaveLength(1);
      expect(dataset[0]).toBe(message);
    });

    it('should add multiple messages maintaining FIFO order', () => {
      const msg1 = createMockMessage('msg-1');
      const msg2 = createMockMessage('msg-2');
      const msg3 = createMockMessage('msg-3');

      datastore.addMessage(msg1);
      datastore.addMessage(msg2);
      datastore.addMessage(msg3);

      const dataset = (datastore as any)._dataset;
      expect(dataset).toHaveLength(3);
      expect(dataset[0]).toBe(msg1);
      expect(dataset[1]).toBe(msg2);
      expect(dataset[2]).toBe(msg3);
    });

    it('should trigger onMessageAdd for all listeners', () => {
      const onMessageAdd1 = jest.fn();
      const onMessageAdd2 = jest.fn();

      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onMessageAdd: onMessageAdd1,
      }));
      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onMessageAdd: onMessageAdd2,
      }));

      const message = createMockMessage('msg-1');
      datastore.addMessage(message);

      // Both listeners should receive the message exactly once
      expect(onMessageAdd1).toHaveBeenCalledWith(message);
      expect(onMessageAdd1).toHaveBeenCalledTimes(1);
      expect(onMessageAdd2).toHaveBeenCalledWith(message);
      expect(onMessageAdd2).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeMessage', () => {
    it('should remove messages by messageId from first, last, and middle positions', () => {
      const msg1 = createMockMessage('msg-1');
      const msg2 = createMockMessage('msg-2');
      const msg3 = createMockMessage('msg-3');
      const msg4 = createMockMessage('msg-4');
      const msg5 = createMockMessage('msg-5');

      datastore.addMessage(msg1);
      datastore.addMessage(msg2);
      datastore.addMessage(msg3);
      datastore.addMessage(msg4);
      datastore.addMessage(msg5);

      // Remove first position
      datastore.removeMessage(msg1);
      let dataset = (datastore as any)._dataset;
      expect(dataset).toEqual([msg2, msg3, msg4, msg5]);

      // Remove last position
      datastore.removeMessage(msg5);
      dataset = (datastore as any)._dataset;
      expect(dataset).toEqual([msg2, msg3, msg4]);

      // Remove middle position
      datastore.removeMessage(msg3);
      dataset = (datastore as any)._dataset;
      expect(dataset).toEqual([msg2, msg4]);
    });

    it('should trigger onMessageRemove for all listeners', () => {
      const onMessageRemove1 = jest.fn();
      const onMessageRemove2 = jest.fn();

      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onMessageRemove: onMessageRemove1,
      }));
      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onMessageRemove: onMessageRemove2,
      }));

      const message = createMockMessage('msg-1');
      datastore.addMessage(message);
      datastore.removeMessage(message);

      // Both listeners should receive the removal notification exactly once
      expect(onMessageRemove1).toHaveBeenCalledWith(message);
      expect(onMessageRemove1).toHaveBeenCalledTimes(1);
      expect(onMessageRemove2).toHaveBeenCalledWith(message);
      expect(onMessageRemove2).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onMessageRemove if message not found', () => {
      const onMessageRemove = jest.fn();

      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onMessageRemove,
      }));

      const msg1 = createMockMessage('msg-1');
      const msg2 = createMockMessage('msg-2');

      datastore.addMessage(msg1);
      datastore.removeMessage(msg2);

      expect(onMessageRemove).not.toHaveBeenCalled();
    });

    it('should match messages by messageId, not reference', () => {
      const msg1 = createMockMessage('msg-1');
      const msg2 = createMockMessage('msg-2');

      datastore.addMessage(msg1);
      datastore.addMessage(msg2);

      // Create new message object with same messageId as msg1
      const msg1Copy = createMockMessage('msg-1', { title: 'Different Title' });
      datastore.removeMessage(msg1Copy);

      const dataset = (datastore as any)._dataset;
      expect(dataset).toHaveLength(1);
      expect(dataset[0]).toBe(msg2);
    });
  });

  describe('toastIndexOfMessage', () => {
    it('should calculate correct FIFO stack indices', () => {
      // FIFO stack calculation: index = length - position - 1
      // First message added is at bottom, last message added is at top
      const msg1 = createMockMessage('msg-1');
      const msg2 = createMockMessage('msg-2');
      const msg3 = createMockMessage('msg-3');
      const msg4 = createMockMessage('msg-4');

      // Single message should be at top (index 0)
      datastore.addMessage(msg1);
      expect(datastore.toastIndexOfMessage(msg1)).toBe(STACK_TOP /* 0 */);

      // Add more messages - verify FIFO ordering
      datastore.addMessage(msg2);
      datastore.addMessage(msg3);
      datastore.addMessage(msg4);

      // Verify stack positions: oldest at bottom, newest at top
      expect(datastore.toastIndexOfMessage(msg1)).toBe(3); // Bottom (oldest)
      expect(datastore.toastIndexOfMessage(msg2)).toBe(2);
      expect(datastore.toastIndexOfMessage(msg3)).toBe(1);
      expect(datastore.toastIndexOfMessage(msg4)).toBe(STACK_TOP /* 0 */); // Top (newest)
    });

    it('should recalculate indices after message removal', () => {
      const msg1 = createMockMessage('msg-1');
      const msg2 = createMockMessage('msg-2');
      const msg3 = createMockMessage('msg-3');
      const msg4 = createMockMessage('msg-4');

      datastore.addMessage(msg1);
      datastore.addMessage(msg2);
      datastore.addMessage(msg3);
      datastore.addMessage(msg4);

      // Remove middle message and verify indices are recalculated
      datastore.removeMessage(msg2);

      expect(datastore.toastIndexOfMessage(msg1)).toBe(2); // Still at bottom
      expect(datastore.toastIndexOfMessage(msg3)).toBe(1);
      expect(datastore.toastIndexOfMessage(msg4)).toBe(STACK_TOP /* 0 */); // Still at top
    });

    it('should return -1 for non-existent messages', () => {
      const msg1 = createMockMessage('msg-1');
      const nonExistent = createMockMessage('msg-2');

      datastore.addMessage(msg1);

      expect(datastore.toastIndexOfMessage(nonExistent)).toBe(-1);
    });
  });

  describe('listenForMessages', () => {
    let mockSocketClient: any;
    let mockCourierClient: any;
    let messageEventListener: any;

    beforeEach(() => {
      messageEventListener = null;

      mockSocketClient = {
        isConnecting: false,
        isOpen: false,
        addMessageEventListener: jest.fn((callback) => {
          messageEventListener = callback;
        }),
      };

      mockCourierClient = {
        inbox: {
          socket: mockSocketClient,
        },
        options: {
          connectionId: 'test-connection-id',
          logger: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      };

      Object.defineProperty(Courier, 'shared', {
        get: jest.fn(() => ({
          client: mockCourierClient,
        })),
        configurable: true,
      });
    });

    it('should register message event listener on socket', async () => {
      await datastore.listenForMessages();

      expect(mockSocketClient.addMessageEventListener).toHaveBeenCalledTimes(1);
      expect(mockSocketClient.addMessageEventListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should add message when NewMessage event is received', async () => {
      await datastore.listenForMessages();

      const message = createMockMessage('msg-1');
      const messageEvent: InboxMessageEventEnvelope = {
        event: InboxMessageEvent.NewMessage,
        data: message,
      };

      messageEventListener(messageEvent);

      const dataset = (datastore as any)._dataset;
      expect(dataset).toHaveLength(1);
      expect(dataset[0]).toBe(message);
    });

    it('should trigger listeners when message is added via socket event', async () => {
      const onMessageAdd = jest.fn();

      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onMessageAdd,
      }));

      await datastore.listenForMessages();

      const message = createMockMessage('msg-1');
      const messageEvent: InboxMessageEventEnvelope = {
        event: InboxMessageEvent.NewMessage,
        data: message,
      };

      messageEventListener(messageEvent);

      expect(onMessageAdd).toHaveBeenCalledWith(message);
    });

    it('should return early when socket is null', async () => {
      // Test with null socket
      Object.defineProperty(Courier, 'shared', {
        get: jest.fn(() => ({
          client: {
            inbox: {
              socket: null,
            },
            options: {
              logger: {
                info: jest.fn(),
              },
            },
          },
        })),
        configurable: true,
      });

      await datastore.listenForMessages();
      expect(mockSocketClient.addMessageEventListener).not.toHaveBeenCalled();

      // Reset mock for next test
      Object.defineProperty(Courier, 'shared', {
        get: jest.fn(() => ({
          client: mockCourierClient,
        })),
        configurable: true,
      });
    });

    it('should still add a message listener if the socket is already connecting', async () => {
      // Test with socket already connecting
      mockSocketClient.isConnecting = true;
      mockSocketClient.isOpen = false;

      await datastore.listenForMessages();

      expect(mockSocketClient.addMessageEventListener).toHaveBeenCalled();
      expect(mockCourierClient.options.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('already connecting or open')
      );
    });

    it('should still add a message listener if the socket is already open', async () => {
      // Test with socket already open
      mockSocketClient.isConnecting = false;
      mockSocketClient.isOpen = true;

      await datastore.listenForMessages();

      expect(mockSocketClient.addMessageEventListener).toHaveBeenCalled();
      expect(mockCourierClient.options.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('already connecting or open')
      );
    });

    it('should still add a message listener if the socket is already connecting', async () => {
      // Test with socket already connecting
      mockSocketClient.isConnecting = true;
      await datastore.listenForMessages();
      expect(mockSocketClient.addMessageEventListener).toHaveBeenCalled();
      expect(mockCourierClient.options.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('already connecting or open')
      );
    });

    it('should handle errors and notify onError handlers', async () => {
      const error = new Error('Test error');
      const onError = jest.fn();

      datastore.addDatastoreListener(new CourierToastDatastoreListener({
        onError,
      }));

      // Make socket throw error
      mockSocketClient.addMessageEventListener = jest.fn(() => {
        throw error;
      });

      await datastore.listenForMessages();

      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});
