import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierInboxDatasetFilter } from "../types/inbox-data-set";
import { CourierInboxDataset } from "./inbox-dataset";

export class CourierInboxDatastore {
  private static instance: CourierInboxDatastore;

  private _datasets: Map<string, CourierInboxDataset> = new Map();

  public createDatasetsFromFilters(filters: Map<string, CourierInboxDatasetFilter>): void {
    this.clearDatasets();

    for (let [id, filter] of filters) {
      const dataset = new CourierInboxDataset(id, filter.archivedMessages, filter.readMessages, filter.tags);
      this._datasets.set(id, dataset);
    }
  }

  public addMessage(message: InboxMessage) {
    for (let dataset of this._datasets.values()) {
      dataset.addMessage(message);
    }
  }

  public async listenForUpdates() {
    const socket = Courier.shared.client?.inbox.socket;

    if (!socket) {
      Courier.shared.client?.options.logger?.info('CourierInbox socket not available');
      return;
    }

    try {
      socket.addMessageEventListener(this.handleMessageEvent);

      // If the socket is already connecting or open, return early
      if (socket.isConnecting || socket.isOpen) {
        Courier.shared.client?.options.logger?.info(`Inbox socket already connecting or open for client ID: [${Courier.shared.client?.options.connectionId}]`);
        return;
      }

      // Connect to the socket. By default, the socket will subscribe to all events for the user after opening.
      await socket.connect();
      Courier.shared.client?.options.logger?.info(`Inbox socket connected for client ID: [${Courier.shared.client?.options.connectionId}]`);
    } catch (error) {
      Courier.shared.client?.options.logger?.error('Failed to connect socket:', error);
    }
  }

  private handleMessageEvent(envelope: InboxMessageEventEnvelope) {
    const event = envelope.event;

    // Handle new message
    if (event === InboxMessageEvent.NewMessage) {
      const message = envelope.data as InboxMessage;
      for (let dataset of this._datasets.values()) {
        dataset.addMessage(message);
      }
      return;
    }

    // Handle all-messages updates
    const isAllMessagesEvent = event === InboxMessageEvent.ArchiveAll ||
        event === InboxMessageEvent.ArchiveRead ||
        event === InboxMessageEvent.MarkAllRead;
    if (isAllMessagesEvent) {
      this.updateAllMessages(event);
    }

    // Handle single-message update
    const messageId = envelope.messageId;
    if (messageId) {
      this.updateMessage(messageId, event);
    }

    Courier.shared.client?.options.logger?.warn(``);
  }

  private updateAllMessages(event: InboxMessageEvent) {
    for (let dataset of this._datasets.values()) {
      switch (event) {
        case InboxMessageEvent.MarkAllRead:
          dataset.readAllMessages();
          break;
        case InboxMessageEvent.ArchiveAll:
          dataset.archiveAllMessages();
          break;
        case InboxMessageEvent.ArchiveRead:
          dataset.archiveReadMessages();
          break;
        default:
          break;
      }
    }
  }

  private updateMessage(messageId: string, event: InboxMessageEvent) {
    for (let dataset of this._datasets.values()) {
      const message = dataset.getMessage(messageId);

      // Message is not present in the dataset
      if (!message) {
        continue;
      }

      switch (event) {
        case InboxMessageEvent.Archive:
          dataset.archiveMessage(message);
          break;
        case InboxMessageEvent.Opened:
          dataset.openMessage(message);
          break;
        case InboxMessageEvent.Read:
          dataset.readMessage(message);
          break;
        case InboxMessageEvent.Unarchive:
          dataset.unarchiveMessage(message);
          break;
        case InboxMessageEvent.Unread:
          dataset.unreadMessage(message);
          break;
        case InboxMessageEvent.Clicked:
        case InboxMessageEvent.Unopened:
        default:
          break;
      }
    }
  }

  private clearDatasets() {
    this._datasets.clear();
  }

  public static get shared(): CourierInboxDatastore {
    if (!CourierInboxDatastore.instance) {
      CourierInboxDatastore.instance = new CourierInboxDatastore();
    }
    return CourierInboxDatastore.instance;
  }

}
