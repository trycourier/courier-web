import { Courier, InboxMessage, MessageEvent } from "@trycourier/courier-js";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "./datastore-listener";
import { FeedType } from "../types/feed-type";

export class CourierInboxDatastore {
  private static instance: CourierInboxDatastore;
  private inboxDataSet?: InboxDataSet;
  private archiveDataSet?: InboxDataSet;
  private dataStoreListeners: CourierInboxDataStoreListener[] = [];
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

  public addDataStoreListener(listener: CourierInboxDataStoreListener) {
    this.dataStoreListeners.push(listener);
  }

  public removeDataStoreListener(listener: CourierInboxDataStoreListener) {
    this.dataStoreListeners = this.dataStoreListeners.filter(l => l !== listener);
  }

  private async fetchDataSet(props: { feedType: FeedType, canUseCache: boolean }): Promise<InboxDataSet> {

    // Return existing dataset if available
    if (props.canUseCache) {
      switch (props.feedType) {
        case 'inbox':
          if (this.inboxDataSet) {
            return this.inboxDataSet;
          }
          break;
        case 'archive':
          if (this.archiveDataSet) {
            return this.archiveDataSet;
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

  public async load(props: { feedType: FeedType, canUseCache: boolean }) {

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
          this.inboxDataSet = dataSet;
          break;
        case 'archive':
          this.archiveDataSet = dataSet;
          break;
      }

      // Update the unread count
      this._unreadCount = unreadCount;

      // Notify the listeners
      this.dataStoreListeners.forEach(listener => {
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
        console.log('CourierInbox socket received message event', event);
        // switch (event.event) {
        //   case EventType.READ:
        //     this.addMessage(event.message, 0, 'inbox');
        //     break;
        //   case 'message.updated':
        //     this.updateMessage(event.message, 0, 'inbox');
        //     break;
        // }
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

  async fetchNextPageOfMessages(props: { feedType: FeedType }): Promise<InboxDataSet | null> {

    switch (props.feedType) {
      case 'inbox':

        if (this.isPaginatingInbox) {
          return null;
        }

        if (this.inboxDataSet?.canPaginate && this.inboxDataSet.paginationCursor) {
          try {
            this.isPaginatingInbox = true;
            const response = await Courier.shared.client?.inbox.getMessages({
              paginationLimit: Courier.shared.paginationLimit,
              startCursor: this.inboxDataSet.paginationCursor
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

        if (this.archiveDataSet?.canPaginate && this.archiveDataSet.paginationCursor) {
          try {
            this.isPaginatingArchive = true;
            const response = await Courier.shared.client?.inbox.getArchivedMessages({
              paginationLimit: Courier.shared.paginationLimit,
              startCursor: this.archiveDataSet.paginationCursor
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

  async clickMessage(message: InboxMessage, _: number): Promise<void> {

    if (!Courier.shared.client) {
      return;
    }

    try {
      if (message.trackingIds?.clickTrackingId) {
        await Courier.shared.client.inbox.click({
          messageId: message.messageId,
          trackingId: message.trackingIds?.clickTrackingId
        });
      }
    } catch (error) {
      console.error('Error clicking message:', error);
    }
  }

  async archiveMessage(message: InboxMessage, index: number): Promise<void> {

    if (!Courier.shared.client) {
      return;
    }

    // Save original message and index
    const originalMessage = message;
    const originalIndex = index;

    try {

      // Remove message from local state
      this.removeMessage(message, index, 'inbox');

      // Find index to insert archived message and add to archive
      if (this.archiveDataSet?.messages) {
        const insertIndex = this.findInsertIndex(message, this.archiveDataSet.messages);
        message.archived = new Date().toISOString();
        this.addMessage(message, insertIndex, 'archive');
      }

      // Call API to archive message
      await Courier.shared.client.inbox.archive({ messageId: message.messageId });

    } catch (error) {
      this.addMessage(originalMessage, originalIndex, 'inbox');
      message.archived = undefined;
      this.removeMessage(message, index, 'archive');
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

  private addPage(dataSet: InboxDataSet, feedType: FeedType) {
    switch (feedType) {
      case 'inbox':
        if (this.inboxDataSet) {
          this.inboxDataSet.canPaginate = dataSet.canPaginate;
          this.inboxDataSet.paginationCursor = dataSet.paginationCursor;
          this.inboxDataSet.messages = [...this.inboxDataSet.messages, ...dataSet.messages];
        }
        break;
      case 'archive':
        if (this.archiveDataSet) {
          this.archiveDataSet.canPaginate = dataSet.canPaginate;
          this.archiveDataSet.paginationCursor = dataSet.paginationCursor;
          this.archiveDataSet.messages = [...this.archiveDataSet.messages, ...dataSet.messages];
        }
        break;
    }
    this.dataStoreListeners.forEach(listener =>
      listener.events.onPageAdded?.(dataSet, feedType)
    );
  }

  private addMessage(message: InboxMessage, index: number, feedType: FeedType) {
    switch (feedType) {
      case 'inbox':
        if (!message.read && this._unreadCount) {
          this._unreadCount = this._unreadCount + 1;
        }
        this.inboxDataSet?.messages.splice(index, 0, message);
        break;
      case 'archive':
        this.archiveDataSet?.messages.splice(index, 0, message);
        break;
    }
    this.dataStoreListeners.forEach(listener => {
      listener.events.onMessageAdd?.(message, index, feedType);
      listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
    });
  }

  private removeMessage(message: InboxMessage, index: number, feedType: FeedType) {
    switch (feedType) {
      case 'inbox':
        if (!message.read && this._unreadCount) {
          this._unreadCount = this._unreadCount - 1;
        }
        this.inboxDataSet?.messages.splice(index, 1);
        break;
      case 'archive':
        this.archiveDataSet?.messages.splice(index, 1);
        break;
    }
    this.dataStoreListeners.forEach(listener => {
      listener.events.onMessageRemove?.(message, index, feedType);
      listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
    });
  }

  private updateMessage(message: InboxMessage, index: number, feedType: FeedType) {
    // this.inboxDataSet?.messages[index] = message;
    // this.dataStoreListeners.forEach(listener =>
    //   listener.events.onMessageUpdate(message, index, feedType)
    // );
  }

}