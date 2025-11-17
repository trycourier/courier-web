import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js/dist/types/inbox";
import { CourierInboxDatasetFilter, CourierInboxFeed, InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataset } from "./inbox-dataset";
import { InboxMessageMutationPublisher, InboxMessageMutationSubscriber } from "./inbox-message-mutation-publisher";
import { CourierInboxDataStoreListener } from "./datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";

export class CourierInboxDatastore {
  private static readonly TAG = "CourierInboxDatastore";

  private static instance: CourierInboxDatastore;

  private _datasets: Map<string, CourierInboxDataset> = new Map();
  private _listeners: CourierInboxDataStoreListener[] = [];

  private _messageMutationPublisher = InboxMessageMutationPublisher.shared;
  private _messageMutationSubscriber: InboxMessageMutationSubscriber = {
    handleMessage: (originatingDatasetId, message) => {
      this.upsertMessage(originatingDatasetId, message);
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

      // Re-attach all existing listeners to the new dataset
      for (let listener of this._listeners) {
        dataset.addDatastoreListener(listener);
      }

      this._datasets.set(id, dataset);
    }
  }

  public addMessage(message: InboxMessage) {
    for (let dataset of this._datasets.values()) {
      dataset.addMessage(message);
    }
  }

  public upsertMessage(originatingDatasetId: string | undefined, message: InboxMessage) {
    for (let [datasetId, dataset] of this._datasets.entries()) {
      // Skip the originating dataset to avoid duplicate processing
      if (datasetId === originatingDatasetId) {
        continue;
      }
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

  /**
   * Load unread counts for multiple tabs in a single GraphQL query.
   * This populates tab badges without loading messages.
   * @param tabIds - Array of tab IDs to load counts for
   */
  public async loadUnreadCountsForTabs(tabIds: string[]): Promise<void> {
    const client = Courier.shared.client;
    if (!client) {
      return;
    }

    // Build filters map for the specified tabs
    const filtersMap: Record<string, CourierGetInboxMessagesQueryFilter> = {};
    for (const tabId of tabIds) {
      const dataset = this._datasets.get(tabId);
      if (dataset) {
        filtersMap[tabId] = dataset.getFilter();
      }
    }

    if (Object.keys(filtersMap).length === 0) {
      return;
    }

    const counts = await client.inbox.getUnreadCounts(filtersMap);

    // Update datasets with the fetched counts
    for (const [tabId, count] of Object.entries(counts)) {
      const dataset = this._datasets.get(tabId);

      // If datasets changed out while the request was in progress,
      // we'll update a dataset with the same ID, but otherwise pass through
      if (dataset) {
        dataset.setPrefetchUnreadCount(count);
      }
    }
  }

  public addDataStoreListener(listener: CourierInboxDataStoreListener): void {
    this._listeners.push(listener);

    for (let dataset of this._datasets.values()) {
      dataset.addDatastoreListener(listener);
    }
  }

  public removeDataStoreListener(listener: CourierInboxDataStoreListener): void {
    this._listeners = this._listeners.filter(l => l !== listener);

    for (let dataset of this._datasets.values()) {
      dataset.removeDatastoreListener(listener);
    }
  }

  public async readMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't mark as read if already read
    if (message.read) {
      return;
    }

    for (let dataset of this._datasets.values()) {
      dataset.readMessage(message);
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.read({ messageId: message.messageId });
    }
  }

  public async unreadMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't mark as unread if already unread
    if (!message.read) {
      return;
    }

    for (let dataset of this._datasets.values()) {
      dataset.unreadMessage(message);
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.unread({ messageId: message.messageId });
    }
  }

  public async openMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't mark as opened if already opened
    if (message.opened) {
      return;
    }

    for (let dataset of this._datasets.values()) {
      dataset.openMessage(message);
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.open({ messageId: message.messageId });
    }
  }

  public async unarchiveMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't unarchive if already unarchived
    if (!message.archived) {
      return;
    }

    for (let dataset of this._datasets.values()) {
      dataset.unarchiveMessage(message);
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.unarchive({ messageId: message.messageId });
    }
  }

  public async archiveMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't archive if already archived
    if (message.archived) {
      return;
    }

    for (let dataset of this._datasets.values()) {
      dataset.archiveMessage(message);
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.archive({ messageId: message.messageId });
    }
  }

  public async clickMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Clicking a message does not mutate it locally

    if (message.trackingIds?.clickTrackingId && canCallApi) {
      await Courier.shared.client?.inbox.click({
        messageId: message.messageId,
        trackingId: message.trackingIds.clickTrackingId
      });
    }
  }

  /** Archive all messages for the specified dataset. */
  public async archiveAllMessages({ canCallApi = true }: { canCallApi?: boolean } = {}): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    for (let dataset of this._datasets.values()) {
      dataset.archiveAllMessages();
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.archiveAll();
    }
  }

  /** Mark all messages read across all datasets. */
  public async readAllMessages({ canCallApi = true }: { canCallApi?: boolean } = {}): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    for (let dataset of this._datasets.values()) {
      dataset.readAllMessages();
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.readAll();
    }
  }

  /** Archive all read messages for the specified dataset. */
  public async archiveReadMessages({ canCallApi = true }: { canCallApi?: boolean } = {}): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    for (let dataset of this._datasets.values()) {
      dataset.archiveReadMessages();
    }

    if (canCallApi) {
      await Courier.shared.client?.inbox.archiveRead();
    }
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
  public get inboxDataSet(): InboxDataSet {
    const dataset =  this.getDatasetById('inbox');

    if (dataset) {
      return dataset;
    }

    return {
      feedType: 'inbox',
      messages: [],
      unreadCount: 0,
      canPaginate: false,
      paginationCursor: null
    };
  }

  /** @deprecated - update callers to use getDataSetById('archive') */
  public get archiveDataSet(): InboxDataSet {
    const dataset =  this.getDatasetById('archive');

    if (dataset) {
      return dataset;
    }

    return {
      feedType: 'archive',
      messages: [],
      unreadCount: 0,
      canPaginate: false,
      paginationCursor: null
    };
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
