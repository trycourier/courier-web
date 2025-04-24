import { Courier, InboxMessage, MessageEvent } from "@trycourier/courier-js";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "./datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";

export class CourierInboxDatastore {
  private static instance: CourierInboxDatastore;
  private _inboxDataSet?: InboxDataSet;
  private _archiveDataSet?: InboxDataSet;
  private _dataStoreListeners: CourierInboxDataStoreListener[] = [];
  private _unreadCount?: number;
  private isPaginatingInbox: boolean = false;
  private isPaginatingArchive: boolean = false;

  public static get shared(): CourierInboxDatastore {
    if (!CourierInboxDatastore.instance) {
      CourierInboxDatastore.instance = new CourierInboxDatastore();
    }
    return CourierInboxDatastore.instance;
  }

  public get unreadCount(): number {
    return this._unreadCount ?? 0;
  }

  public get inboxDataSet(): InboxDataSet {
    return this._inboxDataSet ?? { messages: [], canPaginate: false, paginationCursor: null };
  }

  public get archiveDataSet(): InboxDataSet {
    return this._archiveDataSet ?? { messages: [], canPaginate: false, paginationCursor: null };
  }

  public addDataStoreListener(listener: CourierInboxDataStoreListener) {
    this._dataStoreListeners.push(listener);
  }

  public removeDataStoreListener(listener: CourierInboxDataStoreListener) {
    this._dataStoreListeners = this._dataStoreListeners.filter(l => l !== listener);
  }

  private async fetchDataSet(props: { feedType: CourierInboxFeedType, canUseCache: boolean }): Promise<InboxDataSet> {

    // Return existing dataset if available
    if (props.canUseCache) {
      switch (props.feedType) {
        case 'inbox':
          if (this._inboxDataSet) {
            return this._inboxDataSet;
          }
          break;
        case 'archive':
          if (this._archiveDataSet) {
            return this._archiveDataSet;
          }
          break;
      }
    }

    // Otherwise fetch new dataset
    const response = props.feedType === 'inbox'
      ? await Courier.shared.client?.inbox.getMessages()
      : await Courier.shared.client?.inbox.getArchivedMessages();

    return {
      messages: response?.data?.messages?.nodes ?? [],
      canPaginate: response?.data?.messages?.pageInfo?.hasNextPage ?? false,
      paginationCursor: response?.data?.messages?.pageInfo?.startCursor ?? null,
    };
  }

  private async fetchUnreadCount(props: { canUseCache: boolean }): Promise<number> {

    if (props.canUseCache && this._unreadCount !== undefined) {
      return this._unreadCount;
    }

    const unreadCount = await Courier.shared.client?.inbox.getUnreadMessageCount();
    return unreadCount ?? 0;
  }

  public async load(props: { feedType: CourierInboxFeedType, canUseCache: boolean }) {

    if (!Courier.shared.client) {
      return;
    }

    try {

      // Fetch and update the data set and unread count in parallel
      const [dataSet, unreadCount] = await Promise.all([
        this.fetchDataSet(props),
        this.fetchUnreadCount(props)
      ]);

      switch (props.feedType) {
        case 'inbox':
          this._inboxDataSet = dataSet;
          break;
        case 'archive':
          this._archiveDataSet = dataSet;
          break;
      }

      // Update the unread count
      this._unreadCount = unreadCount;

      // Notify the listeners
      this._dataStoreListeners.forEach(listener => {
        listener.events.onDataSetChange?.(dataSet, props.feedType);
        listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
      });

      // Connect to the socket
      await this.connectSocket();

    } catch (error) {
      console.error('Error loading inbox:', error);
    }
  }

  private async connectSocket() {
    const socket = Courier.shared.client?.inbox.socket;

    try {
      // If the socket is not available, return early
      if (!socket) {
        console.log('CourierInbox socket not available');
        return;
      }

      console.log('CourierInbox socket', Courier.shared.client?.options.connectionId);

      // If the socket is already connected, return early
      if (socket.isConnected) {
        console.log('CourierInbox socket already connected');
        return;
      }

      // Handle new messages
      socket.receivedMessage = (message: InboxMessage) => {
        this.addMessage(message, 0, 'inbox');
      };

      // Handle message events
      socket.receivedMessageEvent = (event: MessageEvent) => {

        let message: InboxMessage | undefined;

        // Get the original message if possible
        if (event.messageId) {
          message = this.getMessage({ messageId: event.messageId });
        }

        switch (event.event) {
          case 'mark-all-read':
            this.readAllMessages();
            break;
          case 'read':
            if (message) {
              this.readMessage(message, false);
            }
            break;
          case 'unread':
            if (message) {
              this.unreadMessage(message, false);
            }
            break;
          case 'opened':
            if (message) {
              this.openMessage(message, false);
            }
            break;
          case 'archive':
            if (message) {
              this.archiveMessage(message, false);
            }
            break;
          case 'click':
            if (message) {
              this.clickMessage(message, false);
            }
            break;
          case 'unopened':
          case 'unarchive':
          case 'unclick':
            break;
        }
      };

      // Connect and subscribe to socket
      await socket.connect();
      await socket.sendSubscribe();
      socket.keepAlive();
      console.log('CourierInbox socket connected');
    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  }

  private getMessage(props: { messageId: string }): InboxMessage | undefined {
    return this._inboxDataSet?.messages.find(m => m.messageId === props.messageId) ??
      this._archiveDataSet?.messages.find(m => m.messageId === props.messageId);
  }

  async fetchNextPageOfMessages(props: { feedType: CourierInboxFeedType }): Promise<InboxDataSet | null> {

    switch (props.feedType) {
      case 'inbox':

        if (this.isPaginatingInbox) {
          return null;
        }

        if (this._inboxDataSet?.canPaginate && this._inboxDataSet.paginationCursor) {
          try {
            this.isPaginatingInbox = true;
            const response = await Courier.shared.client?.inbox.getMessages({
              paginationLimit: Courier.shared.paginationLimit,
              startCursor: this._inboxDataSet.paginationCursor
            });
            const dataSet = {
              messages: response?.data?.messages?.nodes ?? [],
              canPaginate: response?.data?.messages?.pageInfo?.hasNextPage ?? false,
              paginationCursor: response?.data?.messages?.pageInfo?.startCursor ?? null
            };
            this.addPage(dataSet, 'inbox');
            return dataSet;
          } catch (error) {
            console.error('Error fetching next page of inbox messages:', error);
            return null;
          } finally {
            this.isPaginatingInbox = false;
          }
        }

        break;
      case 'archive':

        if (this.isPaginatingArchive) {
          return null;
        }

        if (this._archiveDataSet?.canPaginate && this._archiveDataSet.paginationCursor) {
          try {
            this.isPaginatingArchive = true;
            const response = await Courier.shared.client?.inbox.getArchivedMessages({
              paginationLimit: Courier.shared.paginationLimit,
              startCursor: this._archiveDataSet.paginationCursor
            });
            const dataSet = {
              messages: response?.data?.messages?.nodes ?? [],
              canPaginate: response?.data?.messages?.pageInfo?.hasNextPage ?? false,
              paginationCursor: response?.data?.messages?.pageInfo?.startCursor ?? null
            };
            this.addPage(dataSet, 'archive');
            return dataSet;
          } catch (error) {
            console.error('Error fetching next page of archived messages:', error);
            return null;
          } finally {
            this.isPaginatingArchive = false;
          }
        }

        break;
    }

    return null;
  }

  async readMessage(message: InboxMessage, canCallApi: boolean = true): Promise<void> {

    if (!Courier.shared.client) {
      return;
    }

    // Save original message and index
    const originalMessage = message;

    // If the message is already read, return
    if (originalMessage.read) {
      return;
    }

    const messageIndices = {
      inbox: this._inboxDataSet?.messages.findIndex(m => m.messageId === message.messageId),
      archive: this._archiveDataSet?.messages.findIndex(m => m.messageId === message.messageId)
    };

    try {
      message.read = new Date().toISOString();
      for (const [feedType, index] of Object.entries(messageIndices)) {
        if (index !== undefined) {
          this.updateMessage(message, index, feedType as CourierInboxFeedType);
        }
      }
      if (canCallApi) {
        await Courier.shared.client.inbox.read({ messageId: message.messageId });
      }
    } catch (error) {
      for (const [feedType, index] of Object.entries(messageIndices)) {
        if (index !== undefined) {
          this.updateMessage(originalMessage, index, feedType as CourierInboxFeedType);
        }
      }
      console.error('Error reading message:', error);
    }
  }

  async unreadMessage(message: InboxMessage, canCallApi: boolean = true): Promise<void> {
    if (!Courier.shared.client) {
      return;
    }

    // Save original message and index
    const originalMessage = message;

    // If the message is already unread, return
    if (!originalMessage.read) {
      return;
    }

    const messageIndices = {
      inbox: this._inboxDataSet?.messages.findIndex(m => m.messageId === message.messageId),
      archive: this._archiveDataSet?.messages.findIndex(m => m.messageId === message.messageId)
    };

    try {
      message.read = undefined;
      for (const [feedType, index] of Object.entries(messageIndices)) {
        if (index !== undefined) {
          this.updateMessage(message, index, feedType as CourierInboxFeedType);
        }
      }
      if (canCallApi) {
        await Courier.shared.client.inbox.unread({ messageId: message.messageId });
      }
    } catch (error) {
      for (const [feedType, index] of Object.entries(messageIndices)) {
        if (index !== undefined) {
          this.updateMessage(originalMessage, index, feedType as CourierInboxFeedType);
        }
      }
      console.error('Error unreading message:', error);
    }
  }

  async openMessage(message: InboxMessage, canCallApi: boolean = true): Promise<void> {
    if (!Courier.shared.client) {
      return;
    }

    // Save original message and index
    const originalMessage = message;
    const messageIndices = {
      inbox: this._inboxDataSet?.messages.findIndex(m => m.messageId === message.messageId),
      archive: this._archiveDataSet?.messages.findIndex(m => m.messageId === message.messageId)
    };

    if (!messageIndices.inbox && !messageIndices.archive) {
      return;
    }

    if (originalMessage.opened) {
      return;
    }

    try {
      message.opened = new Date().toISOString();
      for (const [feedType, index] of Object.entries(messageIndices)) {
        if (index !== undefined) {
          this.updateMessage(message, index, feedType as CourierInboxFeedType);
        }
      }
      if (canCallApi) {
        await Courier.shared.client.inbox.open({ messageId: message.messageId });
      }
    } catch (error) {
      for (const [feedType, index] of Object.entries(messageIndices)) {
        if (index !== undefined) {
          this.updateMessage(originalMessage, index, feedType as CourierInboxFeedType);
        }
      }
      console.error('Error opening message:', error);
    }
  }

  async clickMessage(message: InboxMessage, canCallApi: boolean = true): Promise<void> {
    if (!Courier.shared.client) {
      return;
    }

    try {
      if (message.trackingIds?.clickTrackingId && canCallApi) {
        await Courier.shared.client.inbox.click({
          messageId: message.messageId,
          trackingId: message.trackingIds?.clickTrackingId
        });
      }
    } catch (error) {
      console.error('Error clicking message:', error);
    }
  }

  async archiveMessage(message: InboxMessage, canCallApi: boolean = true): Promise<void> {
    if (!Courier.shared.client) {
      return;
    }

    // Save original message and index
    const originalMessage = message;
    const originalIndex = this._inboxDataSet?.messages.findIndex(m => m.messageId === message.messageId);

    if (originalIndex === undefined) {
      return;
    }

    try {
      // Remove message from local state
      this.removeMessage(message, originalIndex, 'inbox');

      // Find index to insert archived message and add to archive
      if (this._archiveDataSet?.messages) {
        const insertIndex = this.findInsertIndex(message, this._archiveDataSet.messages);
        message.archived = new Date().toISOString();
        this.addMessage(message, insertIndex, 'archive');
      }

      // Call API to archive message
      if (canCallApi) {
        await Courier.shared.client.inbox.archive({ messageId: message.messageId });
      }
    } catch (error) {
      this.addMessage(originalMessage, originalIndex, 'inbox');
      message.archived = undefined;
      this.removeMessage(message, originalIndex, 'archive');
    }
  }

  async readAllMessages(canCallApi: boolean = true): Promise<void> {
    if (!Courier.shared.client) {
      return;
    }

    // Store original state for potential rollback
    const originalInboxMessageData = this._inboxDataSet;
    const originalArchiveMessageData = this._archiveDataSet;
    const originalUnreadCount = this._unreadCount;

    try {
      // Read all messages
      this._inboxDataSet?.messages.forEach(message => {
        if (!message.read) {
          message.read = new Date().toISOString();
        }
      });

      // Read all archived messages
      this._archiveDataSet?.messages.forEach(message => {
        if (!message.read) {
          message.read = new Date().toISOString();
        }
      });

      // Update unread count
      this._unreadCount = 0;

      // Notify listeners
      this._dataStoreListeners.forEach(listener => {
        if (this._inboxDataSet) {
          listener.events.onDataSetChange?.(this._inboxDataSet, 'inbox');
        }
        if (this._archiveDataSet) {
          listener.events.onDataSetChange?.(this._archiveDataSet, 'archive');
        }
        listener.events.onUnreadCountChange?.(this._unreadCount!);
      });

      if (canCallApi) {
        await Courier.shared.client.inbox.readAll();
      }

    } catch (error) {
      console.error('Error reading all messages:', error);

      // Reset to original state on error
      if (this._inboxDataSet && originalInboxMessageData) {
        this._inboxDataSet.messages = originalInboxMessageData.messages;
      }
      if (this._archiveDataSet && originalArchiveMessageData) {
        this._archiveDataSet.messages = originalArchiveMessageData.messages;
      }
      this._unreadCount = originalUnreadCount;

      // Notify listeners of the reset
      this._dataStoreListeners.forEach(listener => {
        if (this._inboxDataSet) {
          listener.events.onDataSetChange?.(this._inboxDataSet, 'inbox');
        }
        if (this._archiveDataSet) {
          listener.events.onDataSetChange?.(this._archiveDataSet, 'archive');
        }
        listener.events.onUnreadCountChange?.(this._unreadCount!);
      });
    }
  }

  private findInsertIndex(newMessage: InboxMessage, messages: InboxMessage[]): number {
    // Create copy of messages array
    const allMessages = [...messages];

    // Add the new message
    allMessages.push(newMessage);

    // Sort messages by created timestamp in descending order
    allMessages.sort((a, b) => {
      const aTime = new Date(a.created ?? Date.now()).getTime();
      const bTime = new Date(b.created ?? Date.now()).getTime();
      return bTime - aTime;
    });

    // Find index of new message
    const index = allMessages.findIndex(msg => msg.messageId === newMessage.messageId);

    // Return max of (index-1) or 0 to prevent negative index
    return Math.max(index - 1, 0);
  }

  private addPage(dataSet: InboxDataSet, feedType: CourierInboxFeedType) {
    switch (feedType) {
      case 'inbox':
        if (this._inboxDataSet) {
          this._inboxDataSet.canPaginate = dataSet.canPaginate;
          this._inboxDataSet.paginationCursor = dataSet.paginationCursor;
          this._inboxDataSet.messages = [...this._inboxDataSet.messages, ...dataSet.messages];
        }
        break;
      case 'archive':
        if (this._archiveDataSet) {
          this._archiveDataSet.canPaginate = dataSet.canPaginate;
          this._archiveDataSet.paginationCursor = dataSet.paginationCursor;
          this._archiveDataSet.messages = [...this._archiveDataSet.messages, ...dataSet.messages];
        }
        break;
    }
    this._dataStoreListeners.forEach(listener =>
      listener.events.onPageAdded?.(dataSet, feedType)
    );
  }

  private addMessage(message: InboxMessage, index: number, feedType: CourierInboxFeedType) {
    switch (feedType) {
      case 'inbox':
        if (!message.read && this._unreadCount !== undefined) {
          this._unreadCount = this._unreadCount + 1;
        }
        this._inboxDataSet?.messages.splice(index, 0, message);
        break;
      case 'archive':
        this._archiveDataSet?.messages.splice(index, 0, message);
        break;
    }
    this._dataStoreListeners.forEach(listener => {
      listener.events.onMessageAdd?.(message, index, feedType);
      listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
    });
  }

  private removeMessage(message: InboxMessage, index: number, feedType: CourierInboxFeedType) {
    switch (feedType) {
      case 'inbox':
        if (!message.read && this._unreadCount !== undefined) {
          this._unreadCount = this._unreadCount - 1;
        }
        this._inboxDataSet?.messages.splice(index, 1);
        break;
      case 'archive':
        this._archiveDataSet?.messages.splice(index, 1);
        break;
    }
    this._dataStoreListeners.forEach(listener => {
      listener.events.onMessageRemove?.(message, index, feedType);
      listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
    });
  }

  private updateMessage(message: InboxMessage, index: number, feedType: CourierInboxFeedType) {
    switch (feedType) {
      case 'inbox':
        if (this._unreadCount !== undefined && !message.archived) {
          if (message.read) {
            this._unreadCount = Math.max(0, this._unreadCount - 1);
          }
          if (!message.read) {
            this._unreadCount = this._unreadCount + 1;
          }
        }
        if (this._inboxDataSet) {
          this._inboxDataSet.messages[index] = message;
        }
        break;
      case 'archive':
        if (this._archiveDataSet) {
          this._archiveDataSet.messages[index] = message;
        }
        break;
    }
    this._dataStoreListeners.forEach(listener => {
      listener.events.onMessageUpdate?.(message, index, feedType);
      listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
    });
  }

}
