import { Courier, InboxMessage, InboxMessageEvent } from "@trycourier/courier-js";
import { CourierInboxDatasetFilterOption } from "../types/inbox-data-set";
import { copyMessage } from "../utils/utils";

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
  private _paginationCursor: string | null = null;

  private _archivedMessages: CourierInboxDatasetFilterOption;
  private _readMessages: CourierInboxDatasetFilterOption;
  private _tags?: string[];

  private _unreadCount: number = 0;

  public constructor(
    id: string,
    archivedMessages: CourierInboxDatasetFilterOption,
    readMessages: CourierInboxDatasetFilterOption,
    tags?: string[],
  ) {
    this._id = id;
    this._archivedMessages = archivedMessages;
    this._readMessages = readMessages;
    this._tags = tags;
  }

  /**
   * Add a message to the dataset if it qualifies based on the dataset's filters.
   * @param message the message to add
   * @returns true if the message was added, otherwise false
   */
  addMessage(message: InboxMessage): boolean {
    if (this.messageQualifiesForDataset(message)) {
      this._messages.splice(0, 0, message);
      this._unreadCount += 1;
      return true;
    }

    return false;
  }

  removeMessage(message: InboxMessage): boolean {
    const indexToRemove = this.indexOfMessage(message);
    if (indexToRemove > -1) {
      this._messages.splice(indexToRemove, 1);
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
    }

    this._messages = messageSetAfterMutation;
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

    if (this.messageQualifiesForDataset(messageCopy)) {
      this._messages.splice(index, 1, messageCopy);
    }
  }

  private indexOfMessage(message: InboxMessage): number {
    return this._messages.findIndex(m => m.messageId === message.messageId);
  }



  private messageQualifiesForDataset(message: InboxMessage): boolean {
    // Is the message archived state compatible with the dataset?
    if (message.archived && this._archivedMessages === 'hide' ||
        !message.archived && this._archivedMessages === 'only') {
      return false;
    }

    // Is the message read state compatible with the dataset?
    if (message.read && this._readMessages === 'hide' ||
        !message.read && this._readMessages === 'only') {
      return false;
    }

    // At this point, the message and dataset have compatible
    // read and archived states.

    // If the dataset requires tags, does the message have tags?
    if (this._tags && !message.tags) {
      return false;
    }

    // Does one of the message's tags match this dataset's tags?
    if (this._tags && message.tags) {
      for (const tag in this._tags) {
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
}
