import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatastore } from "../inbox-datastore";
import { CourierInboxFeed } from "../../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore-listener";

const mockGetMessages = jest.fn();
const mockGetArchivedMessages = jest.fn();
const mockGetUnreadMessageCount = jest.fn();
const mockArchiveRead = jest.fn();
const mockArchiveAll = jest.fn();
const mockArchive = jest.fn();
const mockOpen = jest.fn();
const mockBatchOpen = jest.fn();
const mockRead = jest.fn();
const mockUnread = jest.fn();
const mockAddMessageEventListener = jest.fn();
const mockConnect = jest.fn();

// Create mock CourierInboxSocket with mutable properties
const mockSocket = {
  addMessageEventListener: mockAddMessageEventListener,
  connect: mockConnect,
  isConnecting: false,
  isOpen: false,
};

jest.mock("@trycourier/courier-js", () => ({
  Courier: {
    shared: {
      client: {
        inbox: {
          getMessages: () => mockGetMessages(),
          getArchivedMessages: () => mockGetArchivedMessages(),
          getUnreadMessageCount: () => mockGetUnreadMessageCount(),
          archiveRead: () => mockArchiveRead(),
          archiveAll: () => mockArchiveAll(),
          archive: () => mockArchive(),
          open: () => mockOpen(),
          batchOpen: (ids: string[]) => mockBatchOpen(ids),
          read: () => mockRead(),
          unread: () => mockUnread(),
          get socket() {
            return mockSocket;
          },
        },
        options: {
          logger: {
            error: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
          },
          userId: "123",
        },
      },
    },
  },
}));

const getMessage = (options?: { read?: string }): InboxMessage => {
  return {
    messageId: crypto.randomUUID(),
    title: "Test Message",
    body: "Test Body",
    preview: "Test Preview",
    actions: [],
    data: {},
    created: "2021-01-01",
    ...(options?.read && { read: options.read }),
  };
};

const DEFAULT_FEEDS: CourierInboxFeed[] = [
  {
    feedId: 'inbox-feed',
    title: 'Inbox',
    tabs: [{ datasetId: 'inbox', title: 'Inbox', filter: {} }]
  },
  {
    feedId: 'archive-feed',
    title: 'Archive',
    tabs: [{ datasetId: 'archive', title: 'Archive', filter: { archived: true } }]
  }
];

describe("CourierInboxDatastore", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock responses for the datastore (no messages in the inbox or archive).
    mockGetMessages.mockResolvedValue({
      data: {
        count: 0,
        unreadCount: 0,
        messages: {
          nodes: [],
        },
      },
    });
    mockGetArchivedMessages.mockResolvedValue({
      data: {
        count: 0,
        unreadCount: 0,
        messages: {
          nodes: [],
        },
      },
    });
    mockGetUnreadMessageCount.mockResolvedValue(0);

    CourierInboxDatastore.shared.registerFeeds(DEFAULT_FEEDS);
  });

  describe('archiveAllMessages', () => {
    it('should archive all messages and call the API', async () => {
      const READ_MESSAGE = getMessage({ read: "2021-01-01" });
      const UNREAD_MESSAGE = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          unreadCount: 1,
          messages: {
            nodes: [READ_MESSAGE, UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(1);

      await datastore.archiveAllMessages();

      expect(datastore.getDatasetById('inbox')?.messages.length).toBe(0);
      expect(datastore.getDatasetById('archive')?.messages.length).toBe(2);
      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(0);
      expect(datastore.getDatasetById('archive')?.unreadCount).toBe(1);
      expect(mockArchiveAll).toHaveBeenCalled();
    });

    it('should archive all messages and not call the API', async () => {
      const READ_MESSAGE = getMessage({ read: "2021-01-01" });
      const UNREAD_MESSAGE = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          unreadCount: 1,
          messages: {
            nodes: [READ_MESSAGE, UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      await datastore.archiveAllMessages();

      expect(datastore.getDatasetById('inbox')?.messages.length).toBe(0);
      expect(datastore.getDatasetById('archive')?.messages.length).toBe(2);
    });
  });

  describe("archiveReadMessages", () => {
    it("should archive all read messages", async () => {
      const READ_MESSAGE = getMessage({ read: "2021-01-01" });
      const UNREAD_MESSAGE = getMessage();

      // inbox messages response
      mockGetMessages.mockResolvedValueOnce({
        data: {
          count: 2,
          unreadCount: 1,
          messages: {
            nodes: [READ_MESSAGE, UNREAD_MESSAGE],
          },
        },
      })
        // archive messages response
        .mockResolvedValueOnce({
          data: {
            count: 0,
            unreadCount: 0,
            messages: {
              nodes: [],
            },
          },
        })
      mockGetUnreadMessageCount.mockResolvedValue(1);

      // Load the inbox and archive feeds in the order the responses are mocked
      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false, datasetIds: ['inbox'] });
      await datastore.load({ canUseCache: false, datasetIds: ['archive'] });

      await datastore.archiveReadMessages();

      expect(datastore.getDatasetById('inbox')?.messages.length).toBe(1);
      expect(datastore.getDatasetById('archive')?.messages.length).toBe(1);
      expect(datastore.getDatasetById('inbox')?.messages[0]).toEqual(UNREAD_MESSAGE);
      expect(datastore.getDatasetById('archive')?.messages[0]).toMatchObject({ ...READ_MESSAGE, archived: expect.any(String) });
    });

    it("should archive multiple read messages", async () => {
      const READ_MESSAGE_1 = getMessage({ read: "2021-01-01" });
      const READ_MESSAGE_2 = getMessage({ read: "2021-01-01" });

      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          unreadCount: 0,
          messages: {
            nodes: [READ_MESSAGE_1, READ_MESSAGE_2],
          },
        },
      });

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      await datastore.archiveReadMessages();

      expect(datastore.getDatasetById('inbox')?.messages.length).toBe(0);
      expect(datastore.getDatasetById('archive')?.messages.length).toBe(2);
    });
  });

  describe("openMessage", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockBatchOpen.mockResolvedValue(undefined);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should optimistically open a message and not change the unread count", async () => {
      const UNREAD_MESSAGE = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 1,
          messages: {
            nodes: [UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      datastore.openMessage({ message: UNREAD_MESSAGE });

      // Optimistic update is immediate
      expect(datastore.getDatasetById('inbox')?.messages).toHaveLength(1);
      expect(datastore.getDatasetById('inbox')?.messages[0].opened).toBeDefined();
      expect(datastore.totalUnreadCount).toBe(1);

      // Server call happens after the batch timer
      expect(mockBatchOpen).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      expect(mockBatchOpen).toHaveBeenCalledWith([UNREAD_MESSAGE.messageId]);
    });

    it("should not change message when already opened", async () => {
      const UNREAD_MESSAGE = getMessage();

      const openedTimestamp = "2021-01-01T00:00:00Z"
      const openedMessage = { ...UNREAD_MESSAGE, opened: openedTimestamp };

      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 1,
          messages: {
            nodes: [openedMessage],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      datastore.openMessage({ message: openedMessage });

      expect(datastore.getDatasetById('inbox')?.messages).toHaveLength(1);
      expect(datastore.getDatasetById('inbox')?.messages[0].opened).toBe("2021-01-01T00:00:00Z");

      // No server call should be scheduled
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      expect(mockBatchOpen).not.toHaveBeenCalled();
    });

    it("should batch multiple opens within the time window", async () => {
      const MSG_1 = getMessage();
      const MSG_2 = getMessage();
      const MSG_3 = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 3,
          unreadCount: 3,
          messages: {
            nodes: [MSG_1, MSG_2, MSG_3],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(3);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      datastore.openMessage({ message: MSG_1 });
      datastore.openMessage({ message: MSG_2 });
      datastore.openMessage({ message: MSG_3 });

      // All three are optimistically opened
      const messages = datastore.getDatasetById('inbox')?.messages ?? [];
      expect(messages).toHaveLength(3);
      expect(messages.every(m => m.opened)).toBe(true);

      // Single batched server call after the timer
      expect(mockBatchOpen).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      expect(mockBatchOpen).toHaveBeenCalledTimes(1);
      expect(mockBatchOpen).toHaveBeenCalledWith(
        expect.arrayContaining([MSG_1.messageId, MSG_2.messageId, MSG_3.messageId])
      );
    });

    it("should flush separately when opens arrive after the batch window", async () => {
      const MSG_1 = getMessage();
      const MSG_2 = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          unreadCount: 2,
          messages: {
            nodes: [MSG_1, MSG_2],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(2);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      // First open
      datastore.openMessage({ message: MSG_1 });
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      expect(mockBatchOpen).toHaveBeenCalledTimes(1);
      expect(mockBatchOpen).toHaveBeenCalledWith([MSG_1.messageId]);

      // Second open after the first batch flushed
      datastore.openMessage({ message: MSG_2 });
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      expect(mockBatchOpen).toHaveBeenCalledTimes(2);
      expect(mockBatchOpen).toHaveBeenLastCalledWith([MSG_2.messageId]);
    });

    it("should split large batches into chunks of 50", async () => {
      const messages: InboxMessage[] = [];
      for (let i = 0; i < 120; i++) {
        messages.push(getMessage());
      }

      mockGetMessages.mockResolvedValue({
        data: {
          count: messages.length,
          unreadCount: messages.length,
          messages: {
            nodes: messages,
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(messages.length);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      for (const msg of messages) {
        datastore.openMessage({ message: msg });
      }

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      // 120 messages should produce 3 chunks: 50 + 50 + 20
      expect(mockBatchOpen).toHaveBeenCalledTimes(3);
      expect(mockBatchOpen.mock.calls[0][0]).toHaveLength(50);
      expect(mockBatchOpen.mock.calls[1][0]).toHaveLength(50);
      expect(mockBatchOpen.mock.calls[2][0]).toHaveLength(20);

      // No single call should ever exceed 50
      for (const call of mockBatchOpen.mock.calls) {
        expect(call[0].length).toBeLessThanOrEqual(50);
      }
    });

    it("should chunk when batch is just over the limit", async () => {
      const messages: InboxMessage[] = [];
      for (let i = 0; i < 51; i++) {
        messages.push(getMessage());
      }

      mockGetMessages.mockResolvedValue({
        data: {
          count: messages.length,
          unreadCount: messages.length,
          messages: {
            nodes: messages,
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(messages.length);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      for (const msg of messages) {
        datastore.openMessage({ message: msg });
      }

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      // 51 messages should produce 2 chunks: 50 + 1
      expect(mockBatchOpen).toHaveBeenCalledTimes(2);
      expect(mockBatchOpen.mock.calls[0][0]).toHaveLength(50);
      expect(mockBatchOpen.mock.calls[1][0]).toHaveLength(1);
    });

    it("should not chunk when batch is within the limit", async () => {
      const messages: InboxMessage[] = [];
      for (let i = 0; i < 50; i++) {
        messages.push(getMessage());
      }

      mockGetMessages.mockResolvedValue({
        data: {
          count: messages.length,
          unreadCount: messages.length,
          messages: {
            nodes: messages,
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(messages.length);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      for (const msg of messages) {
        datastore.openMessage({ message: msg });
      }

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(mockBatchOpen).toHaveBeenCalledTimes(1);
      expect(mockBatchOpen.mock.calls[0][0]).toHaveLength(50);
    });

    it("should notify error listeners on batch flush failure", async () => {
      const UNREAD_MESSAGE = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 1,
          messages: {
            nodes: [UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);
      mockBatchOpen.mockRejectedValue(new Error("Network error"));

      const onErrorMock = jest.fn();
      const datastore = CourierInboxDatastore.shared;
      const listener = new CourierInboxDataStoreListener({
        onError: onErrorMock,
      });
      datastore.addDataStoreListener(listener);

      await datastore.load({ canUseCache: false });

      datastore.openMessage({ message: UNREAD_MESSAGE });

      // Optimistic update is still applied
      expect(datastore.getDatasetById('inbox')?.messages[0].opened).toBeDefined();

      // Flush the batch and allow the rejection to propagate through Promise.all
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("readMessage", () => {
    it("should mark a message read and decrement unread count", async () => {
      const UNREAD_MESSAGE = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 1,
          messages: {
            nodes: [UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });
      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(1);

      await datastore.readMessage({ message: UNREAD_MESSAGE });

      expect(datastore.getDatasetById('inbox')?.messages).toHaveLength(1);
      expect(datastore.getDatasetById('inbox')?.messages[0].read).toBeDefined();
      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(0);
    });
  });

  describe("unreadMessage", () => {
    it("should remove the read property and increment unread count", async () => {
      const READ_MESSAGE = getMessage({ read: "2021-01-01" });

      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 0,
          messages: {
            nodes: [READ_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(0);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });
      expect(datastore.totalUnreadCount).toBe(0);

      await datastore.unreadMessage({ message: READ_MESSAGE });

      expect(datastore.getDatasetById('inbox')?.messages).toHaveLength(1);
      expect(datastore.getDatasetById('inbox')?.messages[0].read).toBeUndefined();
      expect(datastore.totalUnreadCount).toBe(1);
    });
  });

  describe("listenForUpdates", () => {
    beforeEach(() => {
      // Reset socket state and mocks
      mockSocket.isConnecting = false;
      mockSocket.isOpen = false;
      mockAddMessageEventListener.mockClear();
      mockConnect.mockClear();
      mockAddMessageEventListener.mockReturnValue(jest.fn());
    });

    it("should add a message event listener to the socket", async () => {
      const datastore = CourierInboxDatastore.shared;
      await datastore.listenForUpdates();

      expect(mockAddMessageEventListener).toHaveBeenCalledTimes(1);
      expect(mockAddMessageEventListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should not add duplicate listeners when called multiple times", async () => {
      const mockRemoveListener = jest.fn();
      mockAddMessageEventListener.mockReturnValue(mockRemoveListener);

      const datastore = CourierInboxDatastore.shared;

      // First call
      await datastore.listenForUpdates();
      expect(mockAddMessageEventListener).toHaveBeenCalledTimes(1);
      expect(mockRemoveListener).not.toHaveBeenCalled();

      // Second call - should remove old listener first
      await datastore.listenForUpdates();
      expect(mockRemoveListener).toHaveBeenCalledTimes(1);
      expect(mockAddMessageEventListener).toHaveBeenCalledTimes(2);

      // Third call - should remove previous listener
      await datastore.listenForUpdates();
      expect(mockRemoveListener).toHaveBeenCalledTimes(2);
      expect(mockAddMessageEventListener).toHaveBeenCalledTimes(3);
    });

    it("should not connect if socket is already connecting", async () => {
      mockSocket.isConnecting = true;
      mockSocket.isOpen = false;

      const datastore = CourierInboxDatastore.shared;
      await datastore.listenForUpdates();

      expect(mockAddMessageEventListener).toHaveBeenCalled();
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it("should not connect if socket is already open", async () => {
      mockSocket.isConnecting = false;
      mockSocket.isOpen = true;

      const datastore = CourierInboxDatastore.shared;
      await datastore.listenForUpdates();

      expect(mockAddMessageEventListener).toHaveBeenCalled();
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it("should connect the socket if not already connecting or open", async () => {
      mockSocket.isConnecting = false;
      mockSocket.isOpen = false;

      const datastore = CourierInboxDatastore.shared;
      await datastore.listenForUpdates();

      expect(mockAddMessageEventListener).toHaveBeenCalled();
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe("dataset rollbacks", () => {
    it("should rollback mutations across all datasets when API call fails", async () => {
      // Create a message that will appear in both inbox and archive datasets
      const sharedMessage = getMessage();

      // Mock to return the shared message only for inbox dataset
      mockGetMessages.mockImplementation(() => {
        return Promise.resolve({
          data: {
            count: 1,
            unreadCount: 1,
            messages: { nodes: [sharedMessage] },
          },
        });
      });

      mockGetUnreadMessageCount.mockResolvedValue(1);
      mockRead.mockRejectedValue(new Error("API Error"));

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      // Verify initial state - message is in inbox only
      // (archive dataset filters it out because it's not archived)
      expect(datastore.getDatasetById('inbox')?.messages).toHaveLength(1);
      expect(datastore.getDatasetById('inbox')?.messages[0].read).toBeUndefined();

      // Attempt to read the message - API will fail but error is swallowed
      await datastore.readMessage({ message: sharedMessage });

      // Verify rollback - message should still be unread in inbox
      expect(datastore.getDatasetById('inbox')?.messages).toHaveLength(1);
      expect(datastore.getDatasetById('inbox')?.messages[0].read).toBeUndefined();
      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(1);
    });

    it("should rollback archive operation that moves message between datasets", async () => {
      const messageToArchive = getMessage();

      // Mock to return message in inbox
      mockGetMessages.mockImplementation(() => {
        return Promise.resolve({
          data: {
            count: 1,
            unreadCount: 1,
            messages: { nodes: [messageToArchive] },
          },
        });
      });

      mockGetUnreadMessageCount.mockResolvedValue(1);

      // Mock the archive API call to fail
      mockArchive.mockRejectedValue(new Error("Archive API call failed"));

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      // Verify initial state - message is in inbox
      const inboxBefore = datastore.getDatasetById('inbox');
      expect(inboxBefore?.messages).toHaveLength(1);

      // Attempt to archive - API will fail but error is swallowed
      await datastore.archiveMessage({ message: messageToArchive });

      // Verify rollback - message should still be in inbox and not archived
      const inboxAfter = datastore.getDatasetById('inbox');
      expect(inboxAfter?.messages).toHaveLength(1);
      expect(inboxAfter?.messages[0].archived).toBeUndefined();
    });

    it("should call onError listener when rollback occurs", async () => {
      const testMessage = getMessage();

      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 1,
          messages: { nodes: [testMessage] },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);
      mockRead.mockRejectedValue(new Error("API Error"));

      const onErrorMock = jest.fn();
      const datastore = CourierInboxDatastore.shared;

      // Add a listener with onError callback
      const listener = new CourierInboxDataStoreListener({
        onError: onErrorMock,
      });
      datastore.addDataStoreListener(listener);

      await datastore.load({ canUseCache: false });

      // Attempt operation that will fail (error is swallowed)
      await datastore.readMessage({ message: testMessage });

      // Verify onError was called
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
