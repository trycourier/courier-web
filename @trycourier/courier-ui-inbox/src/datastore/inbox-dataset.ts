import { Courier, InboxMessage } from "@trycourier/courier-js";
import { copyMessage } from "../utils/utils";
import { CourierInboxDatasetFilter, InboxDataSet } from "../types/inbox-data-set";
import { InboxMessageMutationPublisher } from "./inbox-message-mutation-publisher";
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
  private readonly _messageMutationPublisher = InboxMessageMutationPublisher.shared;
  private readonly _datastoreListeners: CourierInboxDataStoreListener[] = [];

  /**
   * The unread count loaded before messages are fetched.
   * Used to show unread badge counts on tabs before the user clicks into them.
   *
   * After messages are fetched, unread count is derived from this._messages.
   * Access via this.unreadCount, where this behavior is codified.
   */
  private _prefetchUnreadCount: number | null = null;

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

  /**
   * Get the current unread count.
   * If messages have been loaded, calculates from messages.
   * Otherwise returns the preloaded count (or 0).
   */
  get unreadCount(): number {
    // If we have messages or have completed first fetch, calculate from messages
    if (this._messages.length > 0 && this._firstFetchComplete) {
      return this._messages.filter(m => !m.read).length;
    }
    // Otherwise use the preloaded count
    return this._prefetchUnreadCount ?? 0;
  }

  /**
   * Set the unread count without loading messages.
   * Used for batch loading tab badges before messages are fetched.
   */
  public setPrefetchUnreadCount(count: number): void {
    this._prefetchUnreadCount = count;
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

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageAdd?.(messageCopy, insertIndex, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });

      return true;
    }

    return false;
  }

  /**
   * Insert or update a message in the dataset, potentially removing the message
   * if the update operation makes it no longer qualify for the dataset's filters.
   *
   * @param message the message to upsert
   * @returns true if the message still qualifies for the dataset and was upserted, false if the message was removed
   */
  upsertMessage(message: InboxMessage): boolean {
    const index = this.indexOfMessage(message);
    const existingMessage = this._messages[index];
    const newMessage = copyMessage(message);

    // Message is already in dataset
    if (index > -1) {

      // Message still qualifies for dataset after mutation
      if (this.messageQualifiesForDataset(newMessage)) {
        this._messages.splice(index, 1, newMessage);

        // Notify listeners of count change
        this._datastoreListeners.forEach(listener => {
          listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
        });

        return true;
      }

      // Message no longer qualifies for dataset
      this.removeMessage(existingMessage);
      return false;
    }

    // Message is not yet in the dataset
    const insertIndex = this.findInsertIndex(message);
    this.addMessage(message, insertIndex);
    return true;
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

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageRemove?.(message, indexToRemove, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });

      return true;
    }

    return false;
  }

  archiveReadMessages() {
    const archiveDate = CourierInboxDataset.getISONow();

    const mutation = (message: InboxMessage) => {
      message.archived = archiveDate;
    }

    const predicate = (message: InboxMessage) => {
      return !!message.read && !message.archived;
    }

    this.applyDatasetMutation(mutation, predicate);
  }

  archiveAllMessages() {
    const archiveDate = CourierInboxDataset.getISONow();

    const mutation = (message: InboxMessage) => {
      message.archived = archiveDate;
    }

    const predicate = (message: InboxMessage) => {
      return !message.archived;
    }

    this.applyDatasetMutation(mutation, predicate);
  }

  readAllMessages() {
    const readDate = CourierInboxDataset.getISONow();

    const mutation = (message: InboxMessage) => {
      message.read = readDate;
    }

    const predicate = (message: InboxMessage) => {
      return !message.read;
    }

    this.applyDatasetMutation(mutation, predicate);
  }

  archiveMessage(message: InboxMessage) {
    const mutation = (message: InboxMessage) => {
      message.archived = CourierInboxDataset.getISONow();
    }

    const predicate = (message: InboxMessage) => {
      return !message.archived;
    }

    this.applyMessageMutation(message, mutation, predicate);
  }

  unarchiveMessage(message: InboxMessage) {
    const mutation = (message: InboxMessage) => {
      message.archived = undefined;
    }

    const predicate = (message: InboxMessage) => {
      return !!message.archived;
    }

    this.applyMessageMutation(message, mutation, predicate);
  }

  readMessage(message: InboxMessage) {
    const mutation = (message: InboxMessage) => {
      message.read = CourierInboxDataset.getISONow();
    }

    const predicate = (message: InboxMessage) => {
      return !message.read;
    }

    this.applyMessageMutation(message, mutation, predicate);
  }

  unreadMessage(message: InboxMessage) {
    const mutation = (message: InboxMessage) => {
      message.read = undefined;
    }

    const predicate = (message: InboxMessage) => {
      return !!message.read;
    }

    this.applyMessageMutation(message, mutation, predicate);
  }

  openMessage(message: InboxMessage) {
    const mutation = (message: InboxMessage) => {
      message.opened = CourierInboxDataset.getISONow();
    }

    const predicate = (message: InboxMessage) => {
      return !message.opened;
    }

    this.applyMessageMutation(message, mutation, predicate);
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

  /**
   * Mutate the message set according to the mutation and predicate provided.
   *
   * @param mutation - function defining the in-place mutation to apply to a message
   * @param predicate - function defining the predicate for which the mutation should be applied
   */
  private applyDatasetMutation(
    mutation: (message: InboxMessage) => void,
    predicate: (message: InboxMessage) => boolean
  ) {
    const unreadCountBeforeMutation = this.unreadCount;
    const mutatedMessages = [];
    const messageSetAfterMutation = [];

    for (let i = 0; i < this._messages.length; i++) {
      const messageCopy = copyMessage(this._messages[i]);

      // Mutate the message
      if (predicate(messageCopy)) {
        mutation(messageCopy)

        // Aggregate mutated messages to upsert into datasets
        mutatedMessages.push(messageCopy);
      }

      // Message is still in dataset
      const messageQualifiesForDataset = this.messageQualifiesForDataset(messageCopy);
      if (messageQualifiesForDataset) {
        messageSetAfterMutation.push(messageCopy);
      }
    }

    // Update this dataset and publish mutated messages for other datasets
    this._messages = messageSetAfterMutation;
    mutatedMessages.forEach(message => {
      this._messageMutationPublisher.publishMessage(this._id, message);
    });

    const unreadCountAfterMutation = this.unreadCount;

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);

      if (unreadCountBeforeMutation !== unreadCountAfterMutation) {
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      }
    });
  }

  private applyMessageMutation(
    message: InboxMessage,
    mutation: (message: InboxMessage) => void,
    predicate: (message: InboxMessage) => boolean
  ) {
    const index = this.indexOfMessage(message);

    if (index < 0 || !predicate(message)) {
      return;
    }

    const messageCopy = copyMessage(message);
    mutation(messageCopy);

    const mutatedMessageQualifies = this.messageQualifiesForDataset(messageCopy);

    if (mutatedMessageQualifies) {
      this._messages.splice(index, 1, messageCopy);

      // Notify listeners
      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageUpdate?.(messageCopy, index, this._id);
        listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
      });
    } else {
      this.removeMessage(message);
    }

    // Publish the mutation to other datasets. The originating dataset (this one) ignores
    // the published message to avoid duplicate processing.
    this._messageMutationPublisher.publishMessage(this._id, messageCopy);
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
      for (const tag in this._filter.tags) {
        if (message.tags.includes(tag)) {
          return true;
        }
      }
    }

    // Either:
    //  - dataset and message have no tags
    //  - dataset doesn't require tags and
    //    the dataset and message have compatible read and archived states
    return true;
  }

  private static getISONow() {
    return new Date().toISOString();
  }

  /**
   * Restore this dataset from a snapshot.
   *
   * Note: _firstFetchComplete and _prefetchUnreadCount do not need to be restored
   * as they indicate specific lifecycle stages for the dataset.
   */
  public restoreFromSnapshot(snapshot: InboxDataSet): void {
    this._messages = snapshot.messages.map(m => copyMessage(m));

    this._hasNextPage = snapshot.canPaginate;
    this._lastPaginationCursor = snapshot.paginationCursor ?? undefined;

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(snapshot, this._id);
      listener.events.onUnreadCountChange?.(this.unreadCount, this._id);
    });
  }
}
