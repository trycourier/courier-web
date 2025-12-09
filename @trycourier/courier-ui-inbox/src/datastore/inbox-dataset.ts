import { Courier, InboxMessage } from "@trycourier/courier-js";
import { copyMessage, mutableInboxMessageFieldsEqual } from "../utils/utils";
import { CourierInboxDatasetFilter, InboxDataSet } from "../types/inbox-data-set";
import { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js/dist/types/inbox";
import { CourierInboxDataStoreListener } from "./datastore-listener";

export class CourierInboxDataset {
  /** The unique ID for this dataset, provided by the consumer to later identify this set of messages. */
  private _id: string;

  /** The set of messages in this dataset. */
  private _messages: InboxMessage[] = [];

  /**
   * True if the first fetch of messages has completed successfully.
   *
   * This marker is used to distinguish if _messages can be returned when cached messages
   * are acceptable, since an empty array of messages could indicate they weren't
   * ever fetched or that they were fetched but there are currently none in the dataset.
   */
  private _firstFetchComplete: boolean = false;

  /** True if the fetched dataset sets hasNextPage to true. */
  private _hasNextPage: boolean = false;

  /**
   * The pagination cursor to pass to subsequent fetch requests
   * or null if this is the first request or a response has indicated
   * there is no next page.
   */
  private _lastPaginationCursor?: string;

  private readonly _filter: CourierInboxDatasetFilter;
  private readonly _datastoreListeners: CourierInboxDataStoreListener[] = [];

  /**
   * The unread count loaded before messages are fetched.
   * Used to show unread badge counts on tabs before the user clicks into them.
   *
   * Unread count is maintained manually (rather than derived from _messages) because:
   *
   * 1. We load unread counts for all tabs in view before their messages are loaded.
   * 2. The set of loaded messages may not fully reflect the unread count for a tab.
   *    Messages are paginated, so unread messages may be present on the server but
   *    but not on the client.
   */
  private _unreadCount: number = 0;

  public constructor(
    id: string,
    filter: CourierInboxDatasetFilter,
  ) {
    this._id = id;

    // Make a copy of the input filters so this dataset's filters are immutable.
    this._filter = {
      tags: filter.tags ? [...(filter.tags)] : undefined,
      archived: filter.archived || false,
      status: filter.status
    };
  }

  /** Get the current unread count. */
  get unreadCount(): number {
    return this._unreadCount;
  }

  /** Private setter for unread count. */
  private set unreadCount(count: number) {
    this._unreadCount = count > 0 ? count : 0;
  }

  /**
   * Set the unread count explicitly.
   * Used for batch loading unread counts for all datasets before messages are fetched.
   */
  public setUnreadCount(count: number): void {
    this.unreadCount = count;
    this._datastoreListeners.forEach(listener => {
      listener.events.onUnreadCountChange?.(count, this._id);
    });
  }

  /**
   * Get the filter configuration for this dataset.
   * Used for batch loading unread counts.
   */
  public getFilter(): CourierGetInboxMessagesQueryFilter {
    return {
      tags: this._filter.tags,
      archived: this._filter.archived,
      status: this._filter.status,
    };
  }

  /**
   * Add a message to the dataset if it qualifies based on the dataset's filters.
   *
   * @param message the message to add
   * @returns true if the message was added, otherwise false
   */
  addMessage(message: InboxMessage, insertIndex: number = 0): boolean {
    const messageCopy = copyMessage(message);
    if (this.messageQualifiesForDataset(messageCopy)) {
      this._messages.splice(insertIndex, 0, messageCopy);

      if (!messageCopy.read) {
        this.unreadCount += 1;
      }

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageAdd?.(messageCopy, insertIndex, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });

      return true;
    }

    return false;
  }

  /**
   * Update the messages and unread count for the dataset based on a change in a message.
   *
   * Based on a message's change (unread -> read, archived -> unarchived, etc) this method
   * inserts, updates, removes, or excludes it from the dataset. Given the before/existing
   * and after states, it updates the unread count.
   *
   * The before state identifies messages that would qualify for the dataset
   * before the dataset (or a particular message in the dataset) has been loaded.
   * These messages may not be explicitly removed from the dataset since they aren't
   * yet present, but may have an effect on the unread count.
   *
   * @param beforeMessage the message before the change
   * @param afterMessage the message after the change
   * @returns true if afterMessage qualifies for the dataset and was inserted or updated, false if the message was removed
   */
  updateWithMessageChange(beforeMessage: InboxMessage, afterMessage: InboxMessage): boolean {
    const index = this.indexOfMessage(afterMessage);
    const existingMessage = this._messages[index];
    const newMessage = copyMessage(afterMessage);

    // The message was already inserted or updated
    // Exit early to prevent double-counting changes to the unread count
    if (existingMessage && mutableInboxMessageFieldsEqual(existingMessage, newMessage)) {
      return true;
    }

    // Message is already in dataset but hasn't been updated yet
    if (existingMessage) {

      // Message still qualifies for dataset after mutation
      // Update it in place and modify unread count based on the state change
      if (this.messageQualifiesForDataset(newMessage)) {
        const unreadChange = this.calculateUnreadChange(existingMessage, newMessage);

        this._messages.splice(index, 1, newMessage);
        this.unreadCount += unreadChange;

        this._datastoreListeners.forEach(listener => {
          listener.events.onMessageUpdate?.(newMessage, index, this._id);
          listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
        });

        return true;
      }

      // Message no longer qualifies for dataset
      // Remove it, which may also update unread count
      this.removeMessage(existingMessage);
      return false;
    }

    // Message is not yet in the dataset
    // Check if the after-mutation message qualifies for this dataset
    if (this.messageQualifiesForDataset(afterMessage)) {

      // Add the message to the dataset
      // We re-implement the addMessage logic here since the unreadCount change logic differs
      // from the public method
      const insertIndex = this.findInsertIndex(afterMessage);
      this._messages.splice(insertIndex, 0, copyMessage(afterMessage));

      // Calculate unread count change based on the transition
      const beforeQualifies = this.messageQualifiesForDataset(beforeMessage);
      const unreadChange = beforeQualifies
        // If beforeMessage qualified but wasn't present, this is a state change and could either
        // increment or decrement the unread count
        ? this.calculateUnreadChange(beforeMessage, afterMessage)

        // If beforeMessage didn't qualify, this is a new message to this dataset
        // Update unread count based on afterMessage's read state
        : (!afterMessage.read ? 1 : 0);

      this.unreadCount += unreadChange;

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageAdd?.(afterMessage, insertIndex, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });

      return true;
    }

    // At this point the message was neither updated, removed, nor added.
    // We must still determine if the mutation affects the unread count for this dataset.
    //
    // Consider the scenario where the unread count for this dataset has been loaded, but its messages have not.
    // In another dataset, a message which affects the unread count here is marked read.
    // We should update the unread count, even though the message hasn't been loaded here yet.

    // beforeMessage would have qualified if the dataset and/or message were loaded
    const beforeQualifies = this.messageQualifiesForDataset(beforeMessage);
    if (beforeQualifies) {

      // Update unreadCount based on the transition
      this.unreadCount += this.calculateUnreadChange(beforeMessage, afterMessage);

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageUpdate?.(newMessage, index, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });
    }

    return false;
  }

  private calculateUnreadChange(beforeMessage: InboxMessage, afterMessage: InboxMessage): number {
    // Message transitioned from read to unread
    if (beforeMessage.read && !afterMessage.read) {
      return 1;
    }

    // Message transitioned from unread to read
    if (!beforeMessage.read && afterMessage.read) {
      return -1;
    }

    // Message did not change read states
    return 0;
  }

  /**
   * Remove the specified message from this dataset, if it's present.
   *
   * @param message the message to remove from this dataset
   * @returns true if the message was removed, else false
   */
  removeMessage(message: InboxMessage): boolean {
    const indexToRemove = this.indexOfMessage(message);
    if (indexToRemove > -1) {
      this._messages.splice(indexToRemove, 1);

      if (!message.read) {
        this.unreadCount -= 1;
      }

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageRemove?.(message, indexToRemove, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });

      return true;
    }

    return false;
  }

  getMessage(messageId: string): InboxMessage | undefined {
    return this._messages.find(message => message.messageId === messageId);
  }

  async loadDataset(canUseCache: boolean): Promise<void> {
    // Returned cached data if it's requested and available
    if (canUseCache && this._firstFetchComplete) {
      this._datastoreListeners.forEach(listener => {
        listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });
      return;
    }

    const fetchedDataset = await this.fetchMessages();

    // Unpack response and call listeners
    this._messages = [...fetchedDataset.messages];
    this.unreadCount = fetchedDataset.unreadCount;
    this._hasNextPage = fetchedDataset.canPaginate;
    this._lastPaginationCursor = fetchedDataset.paginationCursor ?? undefined;
    this._firstFetchComplete = true;

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);
      listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
    });
  }

  async fetchNextPageOfMessages(): Promise<InboxDataSet | null> {
    if (!this._hasNextPage) {
      return null;
    }

    const fetchedDataset = await this.fetchMessages(this._lastPaginationCursor);

    // Unpack response and call listeners
    this._messages = [...this._messages, ...fetchedDataset.messages];
    this._hasNextPage = fetchedDataset.canPaginate;
    this._lastPaginationCursor = fetchedDataset.paginationCursor ?? undefined;
    this._firstFetchComplete = true;

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);
      listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      listener.events.onPageAdded?.(fetchedDataset, this._id);
    });

    return fetchedDataset;
  }

  addDatastoreListener(listener: CourierInboxDataStoreListener): void {
    this._datastoreListeners.push(listener);
  }

  removeDatastoreListener(listener: CourierInboxDataStoreListener): void {
    const index = this._datastoreListeners.indexOf(listener);

    if (index > -1) {
      this._datastoreListeners.splice(index, 1);
    }
  }

  toInboxDataset(): InboxDataSet {
    return {
      feedType: this._id,
      messages: [...this._messages],
      unreadCount: this.unreadCount,
      canPaginate: this._hasNextPage,
      paginationCursor: this._lastPaginationCursor ?? null
    };
  }

  private async fetchMessages(startCursor?: string): Promise<InboxDataSet> {
    const client = Courier.shared.client;

    if (!client?.options.userId) {
      throw new Error('User is not signed in');
    }

    const response = await client.inbox.getMessages({
      paginationLimit: Courier.shared.paginationLimit,
      startCursor,
      filter: this.getFilter(),
    });

    return {
      feedType: this._id,
      messages: [...(response.data?.messages?.nodes ?? [])],
      unreadCount: response.data?.unreadCount ?? 0,
      canPaginate: response.data?.messages?.pageInfo?.hasNextPage ?? false,
      paginationCursor: response.data?.messages?.pageInfo?.startCursor ?? null,
    }
  }

  private indexOfMessage(message: InboxMessage): number {
    return this._messages.findIndex(m => m.messageId === message.messageId);
  }

  /**
   * Find the insert index for a new message in a data set
   * @param newMessage - The new message to insert
   * @param dataSet - The data set to insert the message into
   * @returns The index to insert the message at
   */
  private findInsertIndex(newMessage: InboxMessage): number {
    const messages = this._messages;

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.created && newMessage.created && message.created < newMessage.created) {
        return i;
      }
    }

    return messages.length;
  }

  private messageQualifiesForDataset(message: InboxMessage): boolean {
    // Is the message archived state compatible with the dataset?
    if (message.archived && !this._filter.archived ||
      !message.archived && this._filter.archived) {
      return false;
    }

    // Is the message read state compatible with the dataset?
    if (message.read && this._filter.status === 'unread' ||
      !message.read && this._filter.status === 'read') {
      return false;
    }

    // At this point, the message and dataset have compatible
    // read and archived states.

    // If the dataset requires tags, does the message have tags?
    if (this._filter.tags && !message.tags) {
      return false;
    }

    // Does one of the message's tags match this dataset's tags?
    if (this._filter.tags && message.tags) {
      for (const tag of this._filter.tags) {
        if (message.tags.includes(tag)) {
          return true;
        }
      }
      return false;
    }

    // Either:
    //  - dataset and message have no tags
    //  - dataset doesn't require tags and
    //    the dataset and message have compatible read and archived states
    return true;
  }

  /**
   * Restore this dataset from a snapshot.
   *
   * Note: _firstFetchComplete does not need to be restored
   * as it indicates specific lifecycle stages for the dataset.
   */
  public restoreFromSnapshot(snapshot: InboxDataSet): void {
    this._messages = snapshot.messages.map(m => copyMessage(m));

    this.unreadCount = snapshot.unreadCount;
    this._hasNextPage = snapshot.canPaginate;
    this._lastPaginationCursor = snapshot.paginationCursor ?? undefined;

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(snapshot, this._id);
      listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
    });
  }
}
