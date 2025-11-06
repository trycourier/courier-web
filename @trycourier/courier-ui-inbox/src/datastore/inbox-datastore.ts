import { Courier, InboxClient, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierInboxDatasetFilter } from "../types/inbox-data-set";
import { CourierInboxDataset } from "./inbox-dataset";
import { InboxMessageMutationPublisher, InboxMessageMutationSubscriber } from "./inbox-message-mutation-publisher";
import { CourierInboxDataStoreListener } from "./datastore-listener";

export class CourierInboxDatastore {
  private static instance: CourierInboxDatastore;

  public _datasets: Map<string, CourierInboxDataset> = new Map();

  private _messageMutationPublisher = InboxMessageMutationPublisher.shared;
  private _messageMutationSubscriber: InboxMessageMutationSubscriber = {
    handleMessage: (message) => {
      this.upsertMessage(message);
    }
  };

  /** Access CourierInboxDatastore through {@link CourierInboxDatastore.shared} */
  private constructor() {
    this._messageMutationPublisher.addSubscriber(this._messageMutationSubscriber);
  }

  public createDatasetsFromFilters(filters: Map<string, CourierInboxDatasetFilter>): void {
    this.clearDatasets();

    for (let [id, filter] of filters) {
      const dataset = new CourierInboxDataset(id, filter);
      this._datasets.set(id, dataset);
    }
  }

  public addMessage(message: InboxMessage) {
    for (let dataset of this._datasets.values()) {
      dataset.addMessage(message);
    }
  }

  public upsertMessage(message: InboxMessage) {
    for (let dataset of this._datasets.values()) {
      dataset.upsertMessage(message);
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

  public addDataStoreListener(listener: CourierInboxDataStoreListener): void {
    for (let dataset of this._datasets.values()) {
      dataset.addDatastoreListener(listener);
    }
  }

  public removeDataStoreListener(listener: CourierInboxDataStoreListener): void {

  }

  public async readMessage({ message }: { message: InboxMessage }): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.readMessage(message);
    }

    await Courier.shared.client?.inbox.read({ messageId: message.messageId });
  }

  public async unreadMessage({ message }: { message: InboxMessage }): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.unreadMessage(message);
    }

    await Courier.shared.client?.inbox.unread({ messageId: message.messageId });
  }

  public async openMessage({ message }: { message: InboxMessage }): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.openMessage(message);
    }

    await Courier.shared.client?.inbox.open({ messageId: message.messageId });
  }

  public async unarchiveMessage({ message }: { message: InboxMessage }): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.unarchiveMessage(message);
    }

    await Courier.shared.client?.inbox.unarchive({ messageId: message.messageId });
  }

  public async archiveMessage({ message }: { message: InboxMessage }): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.archiveMessage(message);
    }

    await Courier.shared.client?.inbox.archive({ messageId: message.messageId });
  }

  public async clickMessage({ message }: { message: InboxMessage }): Promise<void> {
    // Clicking a message does not mutate it locally

    if (message.trackingIds?.clickTrackingId) {
      await Courier.shared.client?.inbox.click({
        messageId: message.messageId,
        trackingId: message.trackingIds.clickTrackingId
      });
    }
  }

  public async archiveAllMessages({ datasetId }: { datasetId: string }): Promise<void> {
    const dataset = this._datasets.get(datasetId);
    if (dataset) {
      dataset.archiveAllMessages();
    }

    await Courier.shared.client?.inbox.archiveAll();
  }

  public async readAllMessages({ datasetId }: { datasetId: string }): Promise<void> {
    const dataset = this._datasets.get(datasetId);
    if (dataset) {
      dataset.readAllMessages();
    }

    await Courier.shared.client?.inbox.readAll();
  }

  public async archiveReadMessages({ datasetId }: { datasetId: string }): Promise<void> {
    const dataset = this._datasets.get(datasetId);
    if (dataset) {
      dataset.archiveReadMessages();
    }

    await Courier.shared.client?.inbox.archiveRead();
  }

  public async load(props?: { canUseCache: boolean, datasetIds?: string[] }): Promise<void> {
    const client = Courier.shared.client;

    if (!client?.options.userId) {
      throw new Error('User is not signed in');
    }

    const canUseCache = props?.canUseCache ?? true;

    if (props?.datasetIds) {
      return await this.loadDatasets({
        canUseCache: canUseCache,
        datasets: props.datasetIds.map(this._datasets.get).filter(dataset => !!dataset),
      });
    }

    return await this.loadDatasets({
      canUseCache: canUseCache,
      datasets: Array.from(this._datasets.values()),
    });
  }

  private async loadDatasets(props: { canUseCache: boolean, datasets: CourierInboxDataset[] }): Promise<void> {
    await Promise.all(props.datasets.map(dataset => dataset.loadDataset(props.canUseCache)));
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

  private static get inboxClient(): InboxClient | undefined {
    const client = Courier.shared.client?.inbox;

    if (client) {
      return client;
    }
  }

  public static get shared(): CourierInboxDatastore {
    if (!CourierInboxDatastore.instance) {
      CourierInboxDatastore.instance = new CourierInboxDatastore();
    }
    return CourierInboxDatastore.instance;
  }

}
