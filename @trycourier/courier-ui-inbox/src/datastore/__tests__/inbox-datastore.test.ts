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

const READ_MESSAGE: InboxMessage = {
  messageId: "1",
  title: "Test Message",
  body: "Test Body",
  preview: "Test Preview",
  actions: [],
  data: {},
  created: "2021-01-01",
  read: "2021-01-01",
};

const UNREAD_MESSAGE: InboxMessage = {
  messageId: "2",
  title: "Test Message",
  body: "Test Body",
  preview: "Test Preview",
  actions: [],
  data: {},
  created: "2021-01-01",
};

const DEFAULT_FEEDS: CourierInboxFeed[] = [
  {
    id: 'inbox-feed',
    label: 'Inbox',
    tabs: [{ id: 'inbox', label: 'Inbox', filter: {}}]
  },
  {
    id: 'archive-feed',
    label: 'Archive',
    tabs: [{ id: 'archive', label: 'Archive', filter: { archived: true }}]
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

    CourierInboxDatastore.shared.createDatasetsFromFeeds(DEFAULT_FEEDS);
  });

  describe('archiveAllMessages', () => {
    it('should archive all messages and call the API', async () => {
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

      expect(datastore.inboxDataSet.messages.length).toBe(0);
      expect(datastore.archiveDataSet.messages.length).toBe(2);
      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(0);
      expect(datastore.getDatasetById('archive')?.unreadCount).toBe(1);
      expect(mockArchiveAll).toHaveBeenCalled();
    });

    it('should archive all messages and not call the API if canCallApi is false', async () => {
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

      await datastore.archiveAllMessages({ canCallApi: false });

      expect(datastore.inboxDataSet.messages.length).toBe(0);
      expect(datastore.archiveDataSet.messages.length).toBe(2);
      expect(mockArchiveAll).not.toHaveBeenCalled();
    });
  });

  describe("archiveReadMessages", () => {
    it("should archive all read messages", async () => {
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

      expect(datastore.inboxDataSet.messages.length).toBe(1);
      expect(datastore.archiveDataSet.messages.length).toBe(1);
      expect(datastore.inboxDataSet.messages[0]).toEqual(UNREAD_MESSAGE);
      expect(datastore.archiveDataSet.messages[0]).toMatchObject({ ...READ_MESSAGE, archived: expect.any(String) });
    });

    it("should archive multiple read messages", async () => {
      const readMessage2 = {
        ...READ_MESSAGE,
        messageId: "2",
      };

      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          unreadCount: 0,
          messages: {
            nodes: [READ_MESSAGE, readMessage2],
          },
        },
      });

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      await datastore.archiveReadMessages();

      expect(datastore.inboxDataSet.messages.length).toBe(0);
      expect(datastore.archiveDataSet.messages.length).toBe(2);
    });
  });

  describe("openMessage", () => {
    it("should open a message and not change the unread count", async () => {
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

      await datastore.openMessage({ message: UNREAD_MESSAGE });

      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0].opened).toBeDefined();
      expect(datastore.unreadCount).toBe(1);
    });

    it("should rollback in the event of an error", async () => {
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

      mockOpen.mockRejectedValue(new Error());

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      const originalMessage = { ...UNREAD_MESSAGE };
      await datastore.openMessage({ message: UNREAD_MESSAGE });

      // UNREAD_MESSAGE wasn't mutated and the dataset message is unchanged (rollback successful)
      expect(UNREAD_MESSAGE.opened).toBeUndefined();
      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0]).toEqual(originalMessage);
    });

    it("should not change message when already opened", async () => {
      // Choose a timestamp in the past so it's distinct from `new Date()`.
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

      await datastore.openMessage({ message: openedMessage });

      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0].opened).toBe("2021-01-01T00:00:00Z");
    });

    it("should open a message without calling API when canCallApi is false", async () => {
      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
          unreadCount: 1,
          messages: {
            nodes: [UNREAD_MESSAGE],
          },
        },
      });

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      await datastore.openMessage({ message: UNREAD_MESSAGE, canCallApi: false });

      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0].opened).toBeDefined();
      expect(mockOpen).not.toHaveBeenCalled();
    });
  });

  describe("readMessage", () => {
    it("should mark a message read and decrement unread count", async () => {
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

      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0].read).toBeDefined();
      expect(datastore.getDatasetById('inbox')?.unreadCount).toBe(0);
    });
  });

  describe("unreadMessage", () => {
    it("should remove the read property and increment unread count", async () => {
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
      expect(datastore.unreadCount).toBe(0);

      await datastore.unreadMessage({ message: READ_MESSAGE });

      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0].read).toBeUndefined();
      expect(datastore.unreadCount).toBe(1);
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
      const sharedMessage: InboxMessage = {
        messageId: "shared-1",
        title: "Shared Message",
        body: "This message appears in multiple datasets",
        preview: "Preview",
        actions: [],
        data: {},
        created: "2021-01-01",
      };

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
      const messageToArchive: InboxMessage = {
        messageId: "archive-test-1",
        title: "Message to Archive",
        body: "This will be archived",
        preview: "Preview",
        actions: [],
        data: {},
        created: "2021-01-01",
      };

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
      const testMessage: InboxMessage = {
        messageId: "error-test-1",
        title: "Error Test",
        body: "Testing error handling",
        preview: "Preview",
        actions: [],
        data: {},
        created: "2021-01-01",
      };

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
