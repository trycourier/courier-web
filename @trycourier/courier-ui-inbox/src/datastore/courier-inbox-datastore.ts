import { Courier, InboxMessage, MessageEvent } from "@trycourier/courier-js";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "./courier-inbox-datastore-listener";
import { FeedType } from "../types/feed-type";

export class CourierInboxDatastore {
  private static instance: CourierInboxDatastore;
  private inboxDataSet?: InboxDataSet;
  private archiveDataSet?: InboxDataSet;
  private dataStoreListeners: CourierInboxDataStoreListener[] = [];

  public static get shared(): CourierInboxDatastore {
    if (!CourierInboxDatastore.instance) {
      CourierInboxDatastore.instance = new CourierInboxDatastore();
    }
    return CourierInboxDatastore.instance;
  }

  public addDataStoreListener(listener: CourierInboxDataStoreListener) {
    this.dataStoreListeners.push(listener);
  }

  public removeDataStoreListener(listener: CourierInboxDataStoreListener) {
    this.dataStoreListeners = this.dataStoreListeners.filter(l => l !== listener);
  }

  private async fetchDataSet(props: { feedType: FeedType, canUseCache: boolean }): Promise<InboxDataSet> {

    console.log('CourierInboxDatastore fetchDataSet', props);

    // Return existing dataset if available
    if (props.canUseCache) {
      switch (props.feedType) {
        case 'inbox':
          if (this.inboxDataSet) {
            console.log('CourierInboxDatastore inboxDataSet', this.inboxDataSet);
            return this.inboxDataSet;
          }
          break;
        case 'archive':
          if (this.archiveDataSet) {
            console.log('CourierInboxDatastore archiveDataSet', this.archiveDataSet);
            return this.archiveDataSet;
          }
          break;
      }
    }

    console.log('CourierInboxDatastore fetchDataSet canUseCache', this.inboxDataSet, this.archiveDataSet);

    console.log('CourierInboxDatastore fetchDataSet fetching new dataset', props);

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

  public async load(props: { feedType: FeedType, canUseCache: boolean }) {

    console.log('CourierInboxDatastore load', props);

    if (!Courier.shared.client) {
      return;
    }

    try {

      // Fetch the data set
      const dataSet = await this.fetchDataSet(props);

      console.log('CourierInboxDatastore load dataSet', dataSet, props);

      // Update the data set
      switch (props.feedType) {
        case 'inbox':
          this.inboxDataSet = dataSet;
          break;
        case 'archive':
          console.log('CourierInboxDatastore load archiveDataSet', dataSet);
          this.archiveDataSet = dataSet;
          break;
      }

      // Notify the listeners
      this.dataStoreListeners.forEach(listener =>
        listener.events.onDataSetChange(dataSet, props.feedType)
      );

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
        this.addMessage(message, insertIndex, 'archive');
      }

      // Call API to archive message
      await Courier.shared.client.inbox.archive({ messageId: message.messageId });

    } catch (error) {
      this.addMessage(originalMessage, originalIndex, 'inbox');
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

  private addMessage(message: InboxMessage, index: number, feedType: FeedType) {
    switch (feedType) {
      case 'inbox':
        this.inboxDataSet?.messages.splice(index, 0, message);
        break;
      case 'archive':
        this.archiveDataSet?.messages.splice(index, 0, message);
        break;
    }
    this.dataStoreListeners.forEach(listener =>
      listener.events.onMessageAdd(message, index, feedType)
    );
  }

  private removeMessage(message: InboxMessage, index: number, feedType: FeedType) {
    switch (feedType) {
      case 'inbox':
        this.inboxDataSet?.messages.splice(index, 1);
        break;
      case 'archive':
        this.archiveDataSet?.messages.splice(index, 1);
        break;
    }
    this.dataStoreListeners.forEach(listener =>
      listener.events.onMessageRemove(message, index, feedType)
    );
  }

  private updateMessage(message: InboxMessage, index: number, feedType: FeedType) {
    // this.inboxDataSet?.messages[index] = message;
    // this.dataStoreListeners.forEach(listener =>
    //   listener.events.onMessageUpdate(message, index, feedType)
    // );
  }

}