import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatastore } from "../datastore";

const mockGetMessages = jest.fn();
const mockGetArchivedMessages = jest.fn();
const mockGetUnreadMessageCount = jest.fn();
const mockArchiveRead = jest.fn();

jest.mock("@trycourier/courier-js", () => ({
  Courier: {
    shared: {
      client: {
        inbox: {
          getMessages: () => mockGetMessages(),
          getArchivedMessages: () => mockGetArchivedMessages(),
          getUnreadMessageCount: () => mockGetUnreadMessageCount(),
          archiveRead: () => mockArchiveRead(),
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

      // Load the inbox and archive feeds
      const datastore = CourierInboxDatastore.shared;
      await datastore.load({ feedType: "inbox", canUseCache: false });
      await datastore.load({ feedType: "archive", canUseCache: false });

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
      await datastore.load({ feedType: "inbox", canUseCache: false });
      await datastore.load({ feedType: "archive", canUseCache: false });

      await datastore.archiveReadMessages();

      expect(datastore.inboxDataSet.messages.length).toBe(0);
      expect(datastore.archiveDataSet.messages.length).toBe(2);
    });
  });
});
