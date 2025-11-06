import { Courier, InboxMessage } from "@trycourier/courier-js";
import { copyMessage } from "../utils/utils";
import { CourierInboxDatasetFilter, InboxDataSet } from "../types/inbox-data-set";
import { InboxMessageMutationPublisher } from "./inbox-message-mutation-publisher";
import { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js/dist/types/inbox";
import { CourierInboxDataStoreListener } from "./datastore-listener";

export class CourierInboxDataset {
  /** The unique ID for this dataset. */
  private _id: string;

  /** The set of messages in this dataset. */
  private _messages: InboxMessage[] = [];

  /** True if the fetched dataset sets hasNextPage to true. */
  private _canPaginate: boolean = false;

  /**
   * The pagination cursor to pass to subsequent fetch requests
   * or null if this is the first request or a response has indicated
   * there is no next page.
   */
  private _paginationCursor?: string;;

  private readonly _filter: CourierInboxDatasetFilter;
  private readonly _messageMutationPublisher = InboxMessageMutationPublisher.shared;
  private readonly _datastoreListeners: CourierInboxDataStoreListener[] = [];

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

  /**
   * Add a message to the dataset if it qualifies based on the dataset's filters.
   * @param message the message to add
   * @returns true if the message was added, otherwise false
   */
  addMessage(message: InboxMessage, insertIndex: number = 0): boolean {
    if (this.messageQualifiesForDataset(message)) {
      this._messages.splice(insertIndex, 0, message);
      this._unreadCount += 1;
      return true;
    }

    return false;
  }

  /**
   * Insert or update a message in the dataset, potentially removing the message
   * if the update operation makes it no longer qualify for the dataset's filters.
   *
   * @param message the message to upsert
   * @returns true if the message still qualifies for the dataset and was upserted
   */
  upsertMessage(message: InboxMessage): boolean {
    const index = this.indexOfMessage(message);

    // Message is already in dataset
    if (index > -1) {

      // Message still qualifies for dataset after mutation
      if (this.messageQualifiesForDataset(message)) {
        this._messages.splice(index, 1, message);
        return true;
      }

      // Message no longer qualifies for dataset
      this.removeMessage(message);
      return false;
    }

    const insertIndex = this.findInsertIndex(message);
    this.addMessage(message, insertIndex);
    return true;
  }

  removeMessage(message: InboxMessage): boolean {
    const indexToRemove = this.indexOfMessage(message);
    if (indexToRemove > -1) {
      this._messages.splice(indexToRemove, 1);

      if (!message.read) {
        this._unreadCount--;
      }

      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageRemove?.(message, indexToRemove, this._id);
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
    if (canUseCache && this._messages.length > 0) {
      this._datastoreListeners.forEach(listener => {
        listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);
        listener.events.onUnreadCountChange?.(this._unreadCount, this._id);
      });
      return;
    }

    const client = Courier.shared.client;

    // If the user is not signed in, return early
    if (!client?.options.userId) {
      throw new Error('User is not signed in');
    }

    const paginationLimit = Courier.shared.paginationLimit;
    const inboxQueryFilter: CourierGetInboxMessagesQueryFilter = {
      tags: this._filter.tags,
      archived: this._filter.archived,
      status: this._filter.status,
    };

    const response = await client.inbox.getMessages({
      paginationLimit,
      startCursor: this._paginationCursor,
      filter: inboxQueryFilter,
    });

    this._messages = response.data?.messages?.nodes ?? [];
    this._unreadCount = response.data?.unreadCount ?? 0;
    this._canPaginate = response.data?.messages?.pageInfo?.hasNextPage ?? false;
    this._paginationCursor = response.data?.messages?.pageInfo?.startCursor;

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);
      listener.events.onUnreadCountChange?.(this._unreadCount, this._id);
    });
  }

  addDatastoreListener(listener: CourierInboxDataStoreListener): void {
    this._datastoreListeners.push(listener);
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
    const mutatedMessages = [];
    const messageSetAfterMutation = [];

    for (let i = 0; i < this._messages.length; i++) {
      const messageCopy = copyMessage(this._messages[i]);

      if (predicate(messageCopy)) {
        mutation(messageCopy)

        mutatedMessages.push(messageCopy);
      }

      if (this.messageQualifiesForDataset(messageCopy)) {
        messageSetAfterMutation.push(messageCopy);
      }

      this.updateUnreadCount(this._messages[i], messageCopy);
    }

    this._messages = messageSetAfterMutation;
    mutatedMessages.forEach(message => {
      this._messageMutationPublisher.publishMessage(message);
    });

    this._datastoreListeners.forEach(listener => {
      listener.events.onDataSetChange?.(this.toInboxDataset(), this._id);
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
    } else {
      this.removeMessage(message);
    }

    this.updateUnreadCount(message, messageCopy);

    this._messageMutationPublisher.publishMessage(messageCopy);

    // Only fire onMessageUpdate if the message still qualifies for this dataset
    // If it doesn't qualify, removeMessage has already notified listeners via onMessageRemove
    if (mutatedMessageQualifies) {
      this._datastoreListeners.forEach(listener => {
        listener.events.onMessageUpdate?.(messageCopy, index, this._id);
      });
    }
  }

  private updateUnreadCount(
    before: InboxMessage,
    after: InboxMessage
  ) {
    // No update needed
    if (before.read && after.read || !before.read && !after.read) {
      return;
    }

    // Message transitioned from read to unread
    if (before.read && !after.read) {
      this._unreadCount++;
    }

    // Message transitioned from unread to read
    if (!before.read && after.read) {
      this._unreadCount--;
    }

    this._datastoreListeners.forEach(listener => {
      listener.events.onUnreadCountChange?.(this._unreadCount, this._id);
    });
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

  private toInboxDataset(): InboxDataSet {
    return {
      feedType: this._id,
      messages: [...this._messages],
      canPaginate: this._canPaginate,
      paginationCursor: this._paginationCursor ?? null
    };
  }
}
