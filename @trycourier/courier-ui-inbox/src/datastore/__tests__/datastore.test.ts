import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatastore } from "../datastore";

const mockGetMessages = jest.fn();
const mockGetArchivedMessages = jest.fn();
const mockGetUnreadMessageCount = jest.fn();
const mockArchiveRead = jest.fn();
const mockArchiveAll = jest.fn();
const mockOpen = jest.fn();
const mockRead = jest.fn();
const mockUnread = jest.fn();

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
          open: () => mockOpen(),
          read: () => mockRead(),
          unread: () => mockUnread(),
        },
        options: {
          logger: {
            error: jest.fn(),
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

describe("CourierInboxDatastore", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock responses for the datastore (no messages in the inbox or archive).
    mockGetMessages.mockResolvedValue({
      data: {
        count: 0,
        messages: {
          nodes: [],
        },
      },
    });
    mockGetArchivedMessages.mockResolvedValue({
      data: {
        count: 0,
        messages: {
          nodes: [],
        },
      },
    });
    mockGetUnreadMessageCount.mockResolvedValue(0);
  });

  describe('archiveAllMessages', () => {
    it('should archive all messages and call the API', async () => {
      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          messages: {
            nodes: [READ_MESSAGE, UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      await datastore.archiveAllMessages();

      expect(datastore.inboxDataSet.messages.length).toBe(0);
      expect(datastore.archiveDataSet.messages.length).toBe(2);
      expect(mockArchiveAll).toHaveBeenCalled();
    });

    it('should archive all messages and not call the API if canCallApi is false', async () => {
      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
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
      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
          messages: {
            nodes: [READ_MESSAGE, UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      // Load the inbox and archive feeds
      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });

      await datastore.archiveReadMessages();

      expect(datastore.inboxDataSet.messages.length).toBe(1);
      expect(datastore.archiveDataSet.messages.length).toBe(1);
      expect(datastore.inboxDataSet.messages[0]).toEqual(UNREAD_MESSAGE);
      expect(datastore.archiveDataSet.messages[0]).toEqual(READ_MESSAGE);
    });

    it("should archive multiple read messages", async () => {
      const readMessage2 = {
        ...READ_MESSAGE,
        messageId: "2",
      };

      mockGetMessages.mockResolvedValue({
        data: {
          count: 2,
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

      // UNREAD_MESSAGE wasn't mutated and the dataset message is unchanged
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
          messages: {
            nodes: [UNREAD_MESSAGE],
          },
        },
      });
      mockGetUnreadMessageCount.mockResolvedValue(1);

      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ canUseCache: false });
      expect(datastore.unreadCount).toBe(1);

      await datastore.readMessage({ message: UNREAD_MESSAGE });

      expect(datastore.inboxDataSet.messages).toHaveLength(1);
      expect(datastore.inboxDataSet.messages[0].read).toBeDefined();
      expect(datastore.unreadCount).toBe(0);
    });
  });

  describe("unreadMessage", () => {
    it("should remove the read property and increment unread count", async () => {
      mockGetMessages.mockResolvedValue({
        data: {
          count: 1,
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
});
