import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDataset } from "../inbox-dataset";
import { CourierInboxDataStoreListener } from "../datastore-listener";

describe("CourierInboxDataset", () => {
  // Test messages
  const READ_MESSAGE: InboxMessage = {
    messageId: "1",
    title: "Read Message",
    body: "Body",
    preview: "Preview",
    actions: [],
    data: {},
    created: "2021-01-01T00:00:00Z",
    read: "2021-01-01T00:00:00Z",
  };

  const UNREAD_MESSAGE: InboxMessage = {
    messageId: "2",
    title: "Unread Message",
    body: "Body",
    preview: "Preview",
    actions: [],
    data: {},
    created: "2021-01-01T00:00:00Z",
  };

  const ARCHIVED_MESSAGE: InboxMessage = {
    messageId: "3",
    title: "Archived Message",
    body: "Body",
    preview: "Preview",
    actions: [],
    data: {},
    created: "2021-01-01T00:00:00Z",
    archived: "2021-01-01T00:00:00Z",
  };

  const TAGGED_MESSAGE: InboxMessage = {
    messageId: "4",
    title: "Tagged Message",
    body: "Body",
    preview: "Preview",
    actions: [],
    data: {},
    created: "2021-01-01T00:00:00Z",
    tags: ["important"],
  };

  describe("addMessage", () => {
    it("should add an unread message and increment unread count", () => {
      const dataset = new CourierInboxDataset("test", {});

      const result = dataset.addMessage(UNREAD_MESSAGE);

      expect(result).toBe(true);
      expect(dataset.toInboxDataset().messages.length).toBe(1);
      expect(dataset.toInboxDataset().messages[0].messageId).toBe("2");
      expect(dataset.unreadCount).toBe(1);
    });

    it("should add a read message without incrementing unread count", () => {
      const dataset = new CourierInboxDataset("test", {});

      const result = dataset.addMessage(READ_MESSAGE);

      expect(result).toBe(true);
      expect(dataset.toInboxDataset().messages.length).toBe(1);
      expect(dataset.toInboxDataset().messages[0].messageId).toBe("1");
      expect(dataset.unreadCount).toBe(0);
    });

    it("should return false and not add message when it doesn't qualify for dataset", () => {
      const dataset = new CourierInboxDataset("archived", { archived: true });

      // Non-archived message doesn't qualify for archived dataset
      const result = dataset.addMessage(UNREAD_MESSAGE);

      expect(result).toBe(false);
      expect(dataset.toInboxDataset().messages.length).toBe(0);
      expect(dataset.unreadCount).toBe(0);
    });

    it("should add message to archived dataset when message is archived", () => {
      const dataset = new CourierInboxDataset("archived", { archived: true });

      const result = dataset.addMessage(ARCHIVED_MESSAGE);

      expect(result).toBe(true);
      expect(dataset.toInboxDataset().messages.length).toBe(1);
      expect(dataset.toInboxDataset().messages[0].archived).toBeDefined();
    });

    it("should not add message to unread dataset when message is read", () => {
      const dataset = new CourierInboxDataset("unread", { status: "unread" });

      const result = dataset.addMessage(READ_MESSAGE);

      expect(result).toBe(false);
      expect(dataset.toInboxDataset().messages.length).toBe(0);
    });

    it("should add message to unread dataset when message is unread", () => {
      const dataset = new CourierInboxDataset("unread", { status: "unread" });

      const result = dataset.addMessage(UNREAD_MESSAGE);

      expect(result).toBe(true);
      expect(dataset.toInboxDataset().messages.length).toBe(1);
      expect(dataset.unreadCount).toBe(1);
    });

    it("should add message to tagged dataset when message has matching tag", () => {
      const dataset = new CourierInboxDataset("important", { tags: ["important"] });

      const result = dataset.addMessage(TAGGED_MESSAGE);

      expect(result).toBe(true);
      expect(dataset.toInboxDataset().messages.length).toBe(1);
      expect(dataset.toInboxDataset().messages[0].tags).toContain("important");
      expect(dataset.unreadCount).toBe(1);
    });

    it("should not add message to tagged dataset when message lacks required tag", () => {
      const dataset = new CourierInboxDataset("important", { tags: ["important"] });

      const result = dataset.addMessage(UNREAD_MESSAGE);

      expect(result).toBe(false);
      expect(dataset.toInboxDataset().messages.length).toBe(0);
    });

    it("should insert message at default index (0) when insertIndex not specified", () => {
      const dataset = new CourierInboxDataset("test", {});

      const firstMessage = { ...UNREAD_MESSAGE, messageId: "first" };
      const secondMessage = { ...UNREAD_MESSAGE, messageId: "second" };

      dataset.addMessage(firstMessage);
      dataset.addMessage(secondMessage);

      const messages = dataset.toInboxDataset().messages;
      expect(messages[0].messageId).toBe("second");
      expect(messages[1].messageId).toBe("first");
    });

    it("should insert message at specified index", () => {
      const dataset = new CourierInboxDataset("test", {});

      const firstMessage = { ...UNREAD_MESSAGE, messageId: "first" };
      const secondMessage = { ...UNREAD_MESSAGE, messageId: "second" };
      const thirdMessage = { ...UNREAD_MESSAGE, messageId: "third" };

      dataset.addMessage(firstMessage, 0);
      dataset.addMessage(secondMessage, 0);
      dataset.addMessage(thirdMessage, 1); // Insert between second and first

      const messages = dataset.toInboxDataset().messages;
      expect(messages[0].messageId).toBe("second");
      expect(messages[1].messageId).toBe("third");
      expect(messages[2].messageId).toBe("first");
    });

    it("should call onMessageAdd and onUnreadCountChange listeners", () => {
      const dataset = new CourierInboxDataset("test", {});
      const onMessageAdd = jest.fn();
      const onUnreadCountChange = jest.fn();

      const listener = new CourierInboxDataStoreListener({
        onMessageAdd,
        onUnreadCountChange,
      });
      dataset.addDatastoreListener(listener);

      dataset.addMessage(UNREAD_MESSAGE);

      expect(onMessageAdd).toHaveBeenCalledTimes(1);
      expect(onMessageAdd).toHaveBeenCalledWith(
        expect.objectContaining({ messageId: "2" }),
        0,
        "test"
      );
      expect(onUnreadCountChange).toHaveBeenCalledWith(1, "test");
    });

    it("should copy the message to prevent external mutations", () => {
      const dataset = new CourierInboxDataset("test", {});
      const message = { ...UNREAD_MESSAGE };

      dataset.addMessage(message);

      // Mutate the original message
      message.read = "2021-01-02T00:00:00Z";

      // Dataset message should be unchanged
      const datasetMessage = dataset.toInboxDataset().messages[0];
      expect(datasetMessage.read).toBeUndefined();
    });

    it("should handle messages with nested data objects", () => {
      const dataset = new CourierInboxDataset("test", {});
      const messageWithData = {
        ...UNREAD_MESSAGE,
        data: { key: "value", nested: { deep: "data" } },
      };

      const result = dataset.addMessage(messageWithData);

      expect(result).toBe(true);
      const addedMessage = dataset.toInboxDataset().messages[0];
      expect(addedMessage.data).toEqual({ key: "value", nested: { deep: "data" } });
    });

    it("should correctly track unread count with multiple messages", () => {
      const dataset = new CourierInboxDataset("test", {});

      dataset.addMessage(UNREAD_MESSAGE);
      expect(dataset.unreadCount).toBe(1);

      dataset.addMessage(READ_MESSAGE);
      expect(dataset.unreadCount).toBe(1);

      dataset.addMessage({ ...UNREAD_MESSAGE, messageId: "3" });
      expect(dataset.unreadCount).toBe(2);
    });
  });

  describe("updateWithMessageChange", () => {
    describe("Message already updated (early exit)", () => {
      it("should return true and not modify state if message already updated with same values", () => {
        const dataset = new CourierInboxDataset("test", {});

        // Add message to dataset
        dataset.addMessage(UNREAD_MESSAGE);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        expect(dataset.unreadCount).toBe(1);

        // Try to update with the same message
        const result = dataset.updateWithMessageChange(UNREAD_MESSAGE, UNREAD_MESSAGE);

        expect(result).toBe(true);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        expect(dataset.unreadCount).toBe(1);
      });
    });

    describe("Message in dataset, still qualifies after mutation", () => {
      it("should update message in place when marking unread message as read", () => {
        const dataset = new CourierInboxDataset("test", {});

        // Add unread message
        dataset.addMessage(UNREAD_MESSAGE);
        expect(dataset.unreadCount).toBe(1);

        // Mark as read
        const afterMessage = { ...UNREAD_MESSAGE, read: "2021-01-02T00:00:00Z" };
        const result = dataset.updateWithMessageChange(UNREAD_MESSAGE, afterMessage);

        expect(result).toBe(true);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        expect(dataset.toInboxDataset().messages[0].read).toBe("2021-01-02T00:00:00Z");
        expect(dataset.unreadCount).toBe(0);
      });

      it("should update message in place when marking read message as unread", () => {
        const dataset = new CourierInboxDataset("test", {});

        // Add read message
        dataset.addMessage(READ_MESSAGE);
        expect(dataset.unreadCount).toBe(0);

        // Mark as unread
        const afterMessage = { ...READ_MESSAGE, read: undefined };
        const result = dataset.updateWithMessageChange(READ_MESSAGE, afterMessage);

        expect(result).toBe(true);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        expect(dataset.toInboxDataset().messages[0].read).toBeUndefined();
        expect(dataset.unreadCount).toBe(1);
      });
    });

    describe("Message in dataset, no longer qualifies after mutation", () => {
      it("should remove message when archiving in `archived: false` dataset", () => {
        const dataset = new CourierInboxDataset("inbox", { archived: false });

        dataset.addMessage(UNREAD_MESSAGE);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        expect(dataset.unreadCount).toBe(1);

        // Archive the message
        const afterMessage = { ...UNREAD_MESSAGE, archived: "2021-01-02T00:00:00Z" };
        const result = dataset.updateWithMessageChange(UNREAD_MESSAGE, afterMessage);

        expect(result).toBe(false);
        expect(dataset.toInboxDataset().messages.length).toBe(0);
        expect(dataset.unreadCount).toBe(0);
      });

      it("should remove message when marking as read in unread-only dataset", () => {
        const dataset = new CourierInboxDataset("unread", { status: "unread" });

        dataset.addMessage(UNREAD_MESSAGE);
        expect(dataset.unreadCount).toBe(1);

        // Mark as read
        const afterMessage = { ...UNREAD_MESSAGE, read: "2021-01-02T00:00:00Z" };
        const result = dataset.updateWithMessageChange(UNREAD_MESSAGE, afterMessage);

        expect(result).toBe(false);
        expect(dataset.toInboxDataset().messages.length).toBe(0);
        expect(dataset.unreadCount).toBe(0);
      });
    });

    describe("Message not in dataset", () => {
      it("should decrement unread count if beforeMessage qualifies, afterMessage doesn't qualify", () => {
        const dataset = new CourierInboxDataset("inbox", { archived: false });

        // Dataset has unreadCount = 1 (message exists but isn't loaded yet)
        (dataset as any)._unreadCount = 1;

        // Before qualifies, after does not
        const beforeMessage = UNREAD_MESSAGE;
        const afterMessage = { ...READ_MESSAGE, messageId: "2", archived: "2021-01-02T00:00:00Z" };
        const result = dataset.updateWithMessageChange(beforeMessage, afterMessage);

        expect(result).toBe(false);
        expect(dataset.toInboxDataset().messages.length).toBe(0);

        // Unread count decrements because beforeMessage qualified and after does not
        expect(dataset.unreadCount).toBe(0);
      });

      it("should add message and increment unread count if beforeMessage doesn't qualify, afterMessage qualifies", () => {
        const dataset = new CourierInboxDataset("inbox", { archived: false });

        // Dataset starts empty with unreadCount = 0

        // Unarchive an unread message (was in archive, now qualifies for inbox)
        const beforeMessage = { ...UNREAD_MESSAGE, archived: "2021-01-01T00:00:00Z" };
        const afterMessage = UNREAD_MESSAGE;
        const result = dataset.updateWithMessageChange(beforeMessage, afterMessage);

        expect(result).toBe(true);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        // Unread count increments because afterMessage is unread
        expect(dataset.unreadCount).toBe(1);
      });

      it("should add new read message without incrementing unread count if beforeMessage and afterMessage qualify", () => {
        const dataset = new CourierInboxDataset("inbox", {});

        // New read message
        const beforeMessage = { ...READ_MESSAGE, messageId: "new-read-message" };
        const afterMessage = { ...beforeMessage };

        const result = dataset.updateWithMessageChange(beforeMessage, afterMessage);

        expect(result).toBe(true);
        expect(dataset.toInboxDataset().messages.length).toBe(1);
        expect(dataset.unreadCount).toBe(0);
      });
    });

    describe("Listener notifications", () => {
      it("should call onMessageUpdate listener when updating message in place", () => {
        const dataset = new CourierInboxDataset("test", {});
        const onMessageUpdate = jest.fn();
        const onUnreadCountChange = jest.fn();

        const listener = new CourierInboxDataStoreListener({
          onMessageUpdate,
          onUnreadCountChange,
        });
        dataset.addDatastoreListener(listener);

        dataset.addMessage(UNREAD_MESSAGE);
        onMessageUpdate.mockClear();
        onUnreadCountChange.mockClear();

        const afterMessage = { ...UNREAD_MESSAGE, read: "2021-01-02T00:00:00Z" };
        dataset.updateWithMessageChange(UNREAD_MESSAGE, afterMessage);

        expect(onMessageUpdate).toHaveBeenCalledTimes(1);
        expect(onUnreadCountChange).toHaveBeenCalledWith(0, "test");
      });

      it("should call onMessageAdd listener when adding new message", () => {
        const dataset = new CourierInboxDataset("inbox", { archived: false });
        const onMessageAdd = jest.fn();
        const onUnreadCountChange = jest.fn();

        const listener = new CourierInboxDataStoreListener({
          onMessageAdd,
          onUnreadCountChange,
        });
        dataset.addDatastoreListener(listener);

        // Unarchive a message (beforeMessage is archived, doesn't qualify; afterMessage qualifies)
        const beforeMessage = { ...UNREAD_MESSAGE, archived: "2021-01-01T00:00:00Z" };
        const afterMessage = UNREAD_MESSAGE;
        const result = dataset.updateWithMessageChange(beforeMessage, afterMessage);

        expect(result).toBe(true);
        expect(onMessageAdd).toHaveBeenCalledTimes(1);
        // beforeMessage doesn't qualify (archived), afterMessage is unread, so count = 1
        expect(onUnreadCountChange).toHaveBeenCalledWith(1, "inbox");
      });

      it("should call onMessageRemove listener when removing message", () => {
        const dataset = new CourierInboxDataset("inbox", { archived: false });
        const onMessageRemove = jest.fn();
        const onUnreadCountChange = jest.fn();

        const listener = new CourierInboxDataStoreListener({
          onMessageRemove,
          onUnreadCountChange,
        });
        dataset.addDatastoreListener(listener);

        dataset.addMessage(UNREAD_MESSAGE);
        onMessageRemove.mockClear();
        onUnreadCountChange.mockClear();

        const afterMessage = { ...UNREAD_MESSAGE, archived: "2021-01-02T00:00:00Z" };
        const result = dataset.updateWithMessageChange(UNREAD_MESSAGE, afterMessage);

        expect(result).toBe(false);
        expect(onMessageRemove).toHaveBeenCalledTimes(1);
        expect(onUnreadCountChange).toHaveBeenCalled();
      });
    });

    it("should maintain correct sort order when adding message", () => {
      const dataset = new CourierInboxDataset("test", {});

      const oldMessage = { ...UNREAD_MESSAGE, messageId: "1", created: "2021-01-01T00:00:00Z" };
      const newMessage = { ...UNREAD_MESSAGE, messageId: "2", created: "2021-01-03T00:00:00Z" };
      const middleMessage = { ...UNREAD_MESSAGE, messageId: "3", created: "2021-01-02T00:00:00Z" };

      dataset.addMessage(oldMessage);
      dataset.addMessage(newMessage);

      // Add middle message via updateWithMessageChange
      dataset.updateWithMessageChange(middleMessage, middleMessage);

      const messages = dataset.toInboxDataset().messages;
      expect(messages.length).toBe(3);
      // Messages should be sorted by created date (newest first)
      expect(messages[0].messageId).toBe("2");
      expect(messages[1].messageId).toBe("3");
      expect(messages[2].messageId).toBe("1");
    });

    it("should not allow unread count to go negative", () => {
      const dataset = new CourierInboxDataset("test", {});

      // Manually set unread count to 0
      (dataset as any)._unreadCount = 0;

      // Try to decrement by marking non-existent unread message as read
      const beforeMessage = UNREAD_MESSAGE;
      const afterMessage = { ...UNREAD_MESSAGE, read: "2021-01-02T00:00:00Z" };
      dataset.updateWithMessageChange(beforeMessage, afterMessage);

      // Should not go negative
      expect(dataset.unreadCount).toBe(0);
    });
  });
});
