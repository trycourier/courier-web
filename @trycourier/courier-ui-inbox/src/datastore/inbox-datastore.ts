import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierInboxDatasetFilter, CourierInboxFeed, InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataset } from "./inbox-dataset";
import { InboxMessageMutationPublisher, InboxMessageMutationSubscriber } from "./inbox-message-mutation-publisher";
import { CourierInboxDataStoreListener } from "./datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";

export class CourierInboxDatastore {
  private static readonly TAG = "CourierInboxDatastore";

  private static instance: CourierInboxDatastore;

  private _datasets: Map<string, CourierInboxDataset> = new Map();

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

  public createDatasetsFromFeeds(feeds: CourierInboxFeed[]): void {
    const datasets = new Map<string, CourierInboxDatasetFilter>(
      feeds.flatMap(feed => feed.tabs).map(tab => [tab.id, tab.filter])
    );

    this.createDatasetsFromFilters(datasets);
  }

  private createDatasetsFromFilters(filters: Map<string, CourierInboxDatasetFilter>): void {
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
      socket.addMessageEventListener(event => this.handleMessageEvent(event));

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
    for (let dataset of this._datasets.values()) {
      dataset.removeDatastoreListener(listener);
    }
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

  /** Archive all messages for the specified dataset. */
  public async archiveAllMessages(): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.archiveAllMessages();
    }

    await Courier.shared.client?.inbox.archiveAll();
  }

  /** Mark all messages read across all datasets. */
  public async readAllMessages(): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.readAllMessages();
    }

    await Courier.shared.client?.inbox.readAll();
  }

  /** Archive all read messages for the specified dataset. */
  public async archiveReadMessages(): Promise<void> {
    for (let dataset of this._datasets.values()) {
      dataset.archiveReadMessages();
    }

    await Courier.shared.client?.inbox.archiveRead();
  }

  /**
   * Load datasets from the backend.
   *
   * Props:
   *  - canUseCache: If true and the dataset has already been loaded once, this will return the dataset from memory.
   *  - datasetIds: Optional: The set of dataset IDs to load. If unset, all known datasets will be loaded.
   *
   * @param props - options to load datasets, see method documentation
   */
  public async load(props?: { canUseCache: boolean, datasetIds?: string[] }): Promise<void> {
    const client = Courier.shared.client;

    if (!client?.options.userId) {
      throw new Error('[Datastore] User is not signed in');
    }

    const canUseCache = props?.canUseCache ?? true;

    if (props?.datasetIds) {
      // flatMap asserts all members are defined
      const datasets: CourierInboxDataset[] = props.datasetIds.flatMap(id => {
        const dataset = this._datasets.get(id);
        return dataset ? [dataset] : [];
      });

      return await this.loadDatasets({ canUseCache, datasets });
    }

    return await this.loadDatasets({
      canUseCache,
      datasets: Array.from(this._datasets.values()),
    });
  }

  private async loadDatasets(props: { canUseCache: boolean, datasets: CourierInboxDataset[] }): Promise<void> {
    await Promise.all(props.datasets.map(dataset => dataset.loadDataset(props.canUseCache)));
  }

  /**
   * Fetch the next page of messages for the specified feed or datasetId.
   *
   * feedType is deprecated and will be removed in the next major release.
   * Please migrate to pass the same identifier as datasetId.
   * While both options are present, exactly one is required.
   *
   * @param props - options to fetch the next page of messages, see method documetation
   */
  public async fetchNextPageOfMessages(props: { feedType?: CourierInboxFeedType, datasetId?: string }): Promise<InboxDataSet | null> {
    const client = Courier.shared.client;

    if (!client?.options.userId) {
      throw new Error('User is not signed in');
    }

    let datasetIdToFetch: string;
    if (props.feedType && !props.datasetId) {
      Courier.shared.client?.options.logger.warn(`[${CourierInboxDatastore.TAG}] feedType is deprecated and` +
        `will be removed in the next major version. Please update callers to use datasetIds.`);
      datasetIdToFetch = props.feedType;
    } else if (props.datasetId) {
      datasetIdToFetch = props.datasetId;
    } else {
      throw new Error(`[${CourierInboxDatastore.TAG}] Exactly one of feedType or datasetId is required to call fetchNextPageOfMessages.`);
    }

    const datasetToFetch = this._datasets.get(datasetIdToFetch);
    if (!datasetToFetch) {
      throw new Error(`[${CourierInboxDatastore.TAG}] Attempted to fetch next page of messages for dataset ${datasetIdToFetch}, but the dataset does not exist.`);
    }

    return this.fetchNextPageForDataset({ dataset: datasetToFetch });
  }

  public get totalUnreadCount(): number {
    let unreadCount = 0;
    for (let dataset of this._datasets.values()) {
      unreadCount += dataset.unreadCount;
    }

    return unreadCount;
  }

  public getDatasetById(datasetId: string): InboxDataSet | undefined {
    return this._datasets.get(datasetId)?.toInboxDataset();
  }

  /** @deprecated - update callers to use getDataSetById('inbox') */
  public get inboxDataSet(): InboxDataSet | undefined {
    return this.getDatasetById('inbox');
  }

  /** @deprecated - update callers to use getDataSetById('archive') */
  public get archiveDataSet(): InboxDataSet | undefined {
    return this.getDatasetById('archive');
  }

  /** @deprecated - update callers to use totalUnreadCount or get the unreadCount for a specific dataset */
  public get unreadCount(): number {
    return this.totalUnreadCount;
  }

  private async fetchNextPageForDataset(props: { dataset: CourierInboxDataset }): Promise<InboxDataSet | null> {
    return await props.dataset.fetchNextPageOfMessages();
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
