import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "./datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";
import { DataSetSnapshot, MessageSnapshot } from "../types/snapshots";
import { copyInboxDataSet, copyMessage } from "../utils/utils";

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
    return this._inboxDataSet ?? { feedType: 'inbox', messages: [], canPaginate: false, paginationCursor: null };
  }

  public get archiveDataSet(): InboxDataSet {
    return this._archiveDataSet ?? { feedType: 'archive', messages: [], canPaginate: false, paginationCursor: null };
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
      feedType: props.feedType,
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

  public async load(props?: { feedType: CourierInboxFeedType, canUseCache: boolean }) {

    try {

      // If the user is not signed in, return early
      if (!Courier.shared.client?.options.userId) {
        throw new Error('User is not signed in');
      }

      // If no props are provided, use the default values
      const properties = props ?? { feedType: 'inbox', canUseCache: true };

      // Fetch and update the data set and unread count in parallel
      const [dataSet, unreadCount] = await Promise.all([
        this.fetchDataSet(properties),
        this.fetchUnreadCount(properties)
      ]);

      switch (properties.feedType) {
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
        listener.events.onDataSetChange?.(dataSet, properties.feedType);
        listener.events.onUnreadCountChange?.(this._unreadCount ?? 0);
      });
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error loading inbox:', error);
      this._dataStoreListeners.forEach(listener => {
        listener.events.onError?.(error as Error);
      });
    }
  }

  /** Listen for inbox and archive dataset updates. */
  public async listenForUpdates() {
    try {
      // Ensure both datasets are loaded since we may receive updates for messages in either.
      await this.ensureDataSetsLoaded();

      // Connect to the socket
      await this.connectSocket();
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error listening for updates:', error);
      this._dataStoreListeners.forEach(listener => {
        listener.events.onError?.(error as Error);
      });
    }
  }

  /** Fetch either/both datasets if they aren't already loaded. */
  private async ensureDataSetsLoaded() {
    let dataSetPromises: Promise<void>[] = [];

    if (!this._inboxDataSet) {
      dataSetPromises.push(this.load({ feedType: 'inbox', canUseCache: true }));
    }

    if (!this._archiveDataSet) {
      dataSetPromises.push(this.load({ feedType: 'archive', canUseCache: true }));
    }

    await Promise.all(dataSetPromises);
  }

  private async connectSocket() {
    const socket = Courier.shared.client?.inbox.socket;

    try {
      // If the socket is not available, return early
      if (!socket) {
        Courier.shared.client?.options.logger?.info('CourierInbox socket not available');
        return;
      }

      // If the socket is already connecting or open, return early
      if (socket.isConnecting || socket.isOpen) {
        Courier.shared.client?.options.logger?.info(`Inbox socket already connecting or open for client ID: [${Courier.shared.client?.options.connectionId}]`);
        return;
      }

      // Handle message events
      socket.addMessageEventListener((event: InboxMessageEventEnvelope) => {
        if (event.event === InboxMessageEvent.NewMessage) {
          const message: InboxMessage = event.data as InboxMessage;
          this.addMessage(message, 0, 'inbox');
          return;
        }

        const message = this.getMessage({ messageId: event.messageId });

        switch (event.event) {
          case InboxMessageEvent.MarkAllRead:
            this.readAllMessages({ canCallApi: false });
            break;
          case InboxMessageEvent.Read:
            if (message) {
              this.readMessage({ message, canCallApi: false });
            }
            break;
          case InboxMessageEvent.Unread:
            if (message) {
              this.unreadMessage({ message, canCallApi: false });
            }
            break;
          case InboxMessageEvent.Opened:
            if (message) {
              this.openMessage({ message, canCallApi: false });
            }
            break;
          case InboxMessageEvent.Archive:
            if (message) {
              this.archiveMessage({ message, canCallApi: false });
            }
            break;
          case InboxMessageEvent.ArchiveRead:
            this.archiveReadMessages({ canCallApi: false });
            break;
          case InboxMessageEvent.Clicked:
            if (message) {
              this.clickMessage({ message, canCallApi: false });
            }
            break;
          case InboxMessageEvent.Unarchive:
            if (message) {
              this.unarchiveMessage({ message, canCallApi: false });
            }
            break;
          case InboxMessageEvent.Unopened:
            break;
        }
      });

      // Connect and subscribe to socket
      await socket.connect()
      await socket.sendSubscribe();
      Courier.shared.client?.options.logger?.info(`Inbox socket connected for client ID: [${Courier.shared.client?.options.connectionId}]`);
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Failed to connect socket:', error);
    }
  }

  /**
   * Get a message by messageId from the inbox or archive data set
   * @param props - The message ID
   * @returns The message or undefined if it is not found
   */
  private getMessage(props: { messageId?: string }): InboxMessage | undefined {
    if (!props.messageId) {
      return undefined;
    }

    return this._inboxDataSet?.messages.find(m => m.messageId === props.messageId) ??
      this._archiveDataSet?.messages.find(m => m.messageId === props.messageId);
  }

  /**
   * Fetch the next page of messages
   * @param props - The feed type
   * @returns The next page of messages or null if there is no next page
   */
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
            const dataSet: InboxDataSet = {
              feedType: 'inbox',
              messages: response?.data?.messages?.nodes ?? [],
              canPaginate: response?.data?.messages?.pageInfo?.hasNextPage ?? false,
              paginationCursor: response?.data?.messages?.pageInfo?.startCursor ?? null
            };
            this.addPage(dataSet);
            return dataSet;
          } catch (error) {
            Courier.shared.client?.options.logger?.error('Error fetching next page of inbox messages:', error);
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
            const dataSet: InboxDataSet = {
              feedType: 'archive',
              messages: response?.data?.messages?.nodes ?? [],
              canPaginate: response?.data?.messages?.pageInfo?.hasNextPage ?? false,
              paginationCursor: response?.data?.messages?.pageInfo?.startCursor ?? null
            };
            this.addPage(dataSet);
            return dataSet;
          } catch (error) {
            Courier.shared.client?.options.logger?.error('Error fetching next page of archived messages:', error);
            return null;
          } finally {
            this.isPaginatingArchive = false;
          }
        }

        break;
    }

    return null;
  }

  /**
   * Check if the datastore is loaded and ready to perform mutations
   * @returns True if the datastore is loaded and ready to perform mutations, false otherwise
   */
  private canMutate(): boolean {
    return !!(Courier.shared.client && this._inboxDataSet && this._archiveDataSet);
  }

  async readMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean; }): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Get the datastore snapshot
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    // Copy original message and index
    const snapshot = this.getMessageSnapshot(message);

    // If the message is already read, return
    if (snapshot.message.read) {
      return;
    }

    try {

      // Read the message
      snapshot.message.read = new Date().toISOString();
      this.applyMessageSnapshot(snapshot);

      // Update the unread count
      this._unreadCount = datastoreSnapshot.unreadCount - 1;

      // Notify listeners
      this._dataStoreListeners.forEach(listener => {
        listener.events.onUnreadCountChange?.(this._unreadCount!);
      });

      if (canCallApi) {
        await Courier.shared.client?.inbox.read({ messageId: message.messageId });
      }
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error reading message:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  async unreadMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean; }): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Get the datastore snapshot
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    // Save original message and index
    const snapshot = this.getMessageSnapshot(message);

    // If the message is already unread, return
    if (!snapshot.message.read) {
      return;
    }

    try {

      // Unread the message
      snapshot.message.read = undefined;

      // Apply the message snapshot
      this.applyMessageSnapshot(snapshot);

      // Update the unread count
      this._unreadCount = datastoreSnapshot.unreadCount + 1;

      // Notify listeners
      this._dataStoreListeners.forEach(listener => {
        listener.events.onUnreadCountChange?.(this._unreadCount!);
      });

      if (canCallApi) {
        await Courier.shared.client?.inbox.unread({ messageId: message.messageId });
      }
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error unreading message:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  async openMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean; }): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Save original message and index
    const snapshot = this.getMessageSnapshot(message);

    if (snapshot.inboxIndex === undefined && snapshot.archiveIndex === undefined) {
      return;
    }

    if (snapshot.message.opened) {
      return;
    }

    try {
      message.opened = new Date().toISOString();
      this.applyMessageSnapshot(snapshot);
      if (canCallApi) {
        await Courier.shared.client?.inbox.open({ messageId: message.messageId });
      }
    } catch (error) {
      this.applyMessageSnapshot(snapshot);
      Courier.shared.client?.options.logger?.error('Error opening message:', error);
    }
  }

  async clickMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean; }): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    try {
      if (message.trackingIds?.clickTrackingId && canCallApi) {
        await Courier.shared.client?.inbox.click({
          messageId: message.messageId,
          trackingId: message.trackingIds?.clickTrackingId
        });
      }
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error clicking message:', error);
    }
  }

  async archiveMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean; }): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Get the message snapshot
    const messageSnapshot = this.getMessageSnapshot(message);

    // If the message is not in the inbox, return
    if (messageSnapshot.inboxIndex === undefined) {
      return;
    }

    // Get the datastore snapshots
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    try {

      // Update the message to be archived
      message.archived = new Date().toISOString();

      // Remove message from local state
      this.removeMessage(message, messageSnapshot.inboxIndex, 'inbox');

      // Find index to insert archived message and add to archive
      if (this._archiveDataSet?.messages) {
        const insertIndex = this.findInsertIndex(message, this._archiveDataSet);
        this.addMessage(message, insertIndex, 'archive');
      }

      // Call API to archive message
      if (canCallApi) {
        await Courier.shared.client?.inbox.archive({ messageId: message.messageId });
      }
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error archiving message:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  async unarchiveMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean; }): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Get the datastore snapshots
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    // Get the message snapshot
    const messageSnapshot = this.getMessageSnapshot(message);

    // If the message is not in the archive, return
    if (messageSnapshot.archiveIndex === undefined) {
      return;
    }

    try {

      // Update the message to be unarchived
      messageSnapshot.message.archived = undefined;

      // Remove message from local state
      this.removeMessage(message, messageSnapshot.archiveIndex, 'archive');

      // Find index to insert unarchived message and add to inbox
      if (this._inboxDataSet?.messages) {
        const insertIndex = this.findInsertIndex(message, this._inboxDataSet);
        this.addMessage(message, insertIndex, 'inbox');
      }

      // Call API to unarchive message
      if (canCallApi) {
        await Courier.shared.client?.inbox.unarchive({ messageId: message.messageId });
      }
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error unarchiving message:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  async archiveReadMessages({ canCallApi = true }: { canCallApi?: boolean; } = {}): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Get snapshot of the inbox data set
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    try {

      const timestamp = new Date().toISOString();

      // Archive all read messages
      const messagesToArchive = this._inboxDataSet?.messages.filter(message => message.read) ?? [];
      messagesToArchive.forEach(message => {

        // Update the message to be archived
        message.archived = timestamp;

        // Remove message from inbox
        const inboxIndex = this._inboxDataSet?.messages.findIndex(m => m.messageId === message.messageId);
        if (inboxIndex !== undefined && inboxIndex !== -1) {
          this._inboxDataSet?.messages.splice(inboxIndex, 1);
        }

        // Add message to archive
        if (this._archiveDataSet?.messages) {
          const insertIndex = this.findInsertIndex(message, this._archiveDataSet);
          this._archiveDataSet.messages.splice(insertIndex, 0, message);
        }

      });

      // Notify listeners
      this._dataStoreListeners.forEach(listener => {
        if (this._inboxDataSet) {
          listener.events.onDataSetChange?.(this._inboxDataSet, 'inbox');
        }
        if (this._archiveDataSet) {
          listener.events.onDataSetChange?.(this._archiveDataSet, 'archive');
        }
      });

      // Call API to archive read messages
      if (canCallApi) {
        await Courier.shared.client?.inbox.archiveRead();
      }

    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error archiving read messages:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  async archiveAllMessages({ canCallApi = true }: { canCallApi?: boolean; } = {}): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Get snapshot of the inbox data set
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    try {

      const timestamp = new Date().toISOString();

      // Archive all read messages
      this._inboxDataSet?.messages.forEach(message => {
        message.archived = timestamp;

        // Add message to archive
        if (this._archiveDataSet?.messages) {
          const insertIndex = this.findInsertIndex(message, this._archiveDataSet);
          this._archiveDataSet.messages.splice(insertIndex, 0, message);
        }

      });

      // Clear the inbox data set
      this._inboxDataSet = {
        messages: [],
        canPaginate: false,
        paginationCursor: null,
        feedType: 'inbox',
      };

      // Update the unread count
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

      // Call API to archive all messages
      if (canCallApi) {
        await Courier.shared.client?.inbox.archiveAll();
      }

    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error archiving all messages:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  async readAllMessages({ canCallApi = true }: { canCallApi?: boolean; } = {}): Promise<void> {
    if (!this.canMutate()) {
      return;
    }

    // Store original state for potential rollback
    const datastoreSnapshot = this.getDatastoreSnapshot(this.unreadCount, this._inboxDataSet!, this._archiveDataSet!);

    try {

      const timestamp = new Date().toISOString();

      // Read all messages
      this._inboxDataSet?.messages.forEach(message => {
        if (!message.read) {
          message.read = timestamp;
        }
      });

      // Read all archived messages
      this._archiveDataSet?.messages.forEach(message => {
        if (!message.read) {
          message.read = timestamp;
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
        await Courier.shared.client?.inbox.readAll();
      }

    } catch (error) {
      Courier.shared.client?.options.logger?.error('Error reading all messages:', error);
      this.applyDatastoreSnapshot(datastoreSnapshot);
    }
  }

  /**
   * Find the insert index for a new message in a data set
   * @param newMessage - The new message to insert
   * @param dataSet - The data set to insert the message into
   * @returns The index to insert the message at
   */
  private findInsertIndex(newMessage: InboxMessage, dataSet: InboxDataSet): number {
    const messages = dataSet.messages;

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.created && newMessage.created && message.created < newMessage.created) {
        return i;
      }
    }

    return messages.length;
  }

  private addPage(dataSet: InboxDataSet) {
    switch (dataSet.feedType) {
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
      listener.events.onPageAdded?.(dataSet, dataSet.feedType)
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

  /**
   * Apply a message snapshot to the data store
   * @param snapshot - The message snapshot to apply
   */
  private applyMessageSnapshot(snapshot: MessageSnapshot) {
    if (snapshot.archiveIndex !== undefined) {
      this.updateMessage(snapshot.message, snapshot.archiveIndex, 'archive');
    }
    if (snapshot.inboxIndex !== undefined) {
      this.updateMessage(snapshot.message, snapshot.inboxIndex, 'inbox');
    }
  }

  private applyDatastoreSnapshot(snapshot: DataSetSnapshot) {
    const { unreadCount, inbox, archive } = snapshot;

    // Update the data sets
    this._inboxDataSet = inbox;
    this._archiveDataSet = archive;

    // Notify listeners
    this._dataStoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(inbox, 'inbox');
      listener.events.onDataSetChange?.(archive, 'archive');
      listener.events.onUnreadCountChange?.(unreadCount);
    });
  }

  /**
   * Update a message in the data store
   * @param message - The message to update
   * @param index - The index of the message
   * @param feedType - The feed type of the message
   */
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

  /**
   * Copy an inbox data set
   * @param dataSet - The inbox data set to copy
   * @returns A copy of the inbox data set
   */
  private getDatastoreSnapshot(unreadCount: number, inboxDataSet: InboxDataSet, archiveDataSet: InboxDataSet): DataSetSnapshot {
    return {
      unreadCount,
      inbox: copyInboxDataSet(inboxDataSet),
      archive: copyInboxDataSet(archiveDataSet),
    };
  }

  /**
   * Copy an inbox message with its archive and inbox indices
   * @param message - The inbox message to copy
   * @returns A copy of the inbox message with its archive and inbox indices
   */
  private getMessageSnapshot(message: InboxMessage): MessageSnapshot {
    const archiveIndex = this._archiveDataSet
      ? this._archiveDataSet.messages.findIndex(m => m.messageId === message.messageId)
      : undefined;

    const inboxIndex = this._inboxDataSet
      ? this._inboxDataSet.messages.findIndex(m => m.messageId === message.messageId)
      : undefined;

    return {
      message: copyMessage(message),
      archiveIndex,
      inboxIndex,
    };
  }

}
