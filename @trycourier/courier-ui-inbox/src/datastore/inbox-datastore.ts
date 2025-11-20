import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js/dist/types/inbox";
import { CourierInboxDatasetFilter, CourierInboxFeed, InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataset } from "./inbox-dataset";
import { CourierInboxDataStoreListener } from "./datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";
import { copyInboxDataSet } from "../utils/utils";

/**
 * Snapshot of a single dataset's state for rollback purposes
 */
interface DatasetSnapshot {
  id: string;
  dataset: InboxDataSet;
}

/**
 * Snapshot of the entire datastore state for rollback purposes
 */
interface DatastoreSnapshot {
  datasets: DatasetSnapshot[];
}

/**
 * Shared datastore for Inbox components.
 *
 * CourierInboxDatastore is a singleton. Use `CourierInboxDatastore.shared`
 * to access the shared instance.
 *
 * @public
 */
export class CourierInboxDatastore {
  private static readonly TAG = "CourierInboxDatastore";

  private static instance: CourierInboxDatastore;

  private _datasets: Map<string, CourierInboxDataset> = new Map();
  private _listeners: CourierInboxDataStoreListener[] = [];
  private _removeMessageEventListener?: () => void;

  /**
   * Global message store is a map of <Message ID, Message> for all messages
   * that have been loaded.
   *
   * This acts as the source of truth to apply messages mutations to a message
   * given its ID and propagate those mutations to individual datasets.
   */
  private _globalMessages = new Map<string, InboxMessage>();

  /** Access CourierInboxDatastore through {@link CourierInboxDatastore.shared} */
  private constructor() {}

  /**
   * Instantiate the datastore with the feeds specified.
   *
   * Feeds are added to the datastore as datasets. Each feed has a respective
   * dataset. Existing datasets will be cleared before the feeds specified are added.
   *
   * @param feeds - The feeds with which to instantiate the datastore
   */
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

  /**
   * Add a message to the datastore.
   *
   * The message will be added to any datasets for which it qualifies.
   *
   * @param message - The message to add
   */
  public addMessage(message: InboxMessage) {
    // Add to global store
    this._globalMessages.set(message.messageId, message);

    // Add to all qualifying datasets
    for (let dataset of this._datasets.values()) {
      dataset.addMessage(message);
    }
  }

  private upsertMessage(beforeMessage: InboxMessage, afterMessage: InboxMessage) {
    for (let dataset of this._datasets.values()) {
      dataset.updateWithMessageChange(beforeMessage, afterMessage);
    }
  }

  /**
   * Listen for real-time message updates from the Courier backend.
   *
   * If an existing WebSocket connection is open, it will be re-used. If not,
   * a new connection will be opened.
   */
  public async listenForUpdates() {
    const socket = Courier.shared.client?.inbox.socket;

    if (!socket) {
      Courier.shared.client?.options.logger?.info('CourierInbox socket not available');
      return;
    }

    try {
      // Remove any existing listener before adding a new one.
      // This both prevents multiple listeners from being added to the same WebSocket client
      // and makes sure the listener is on the current WebSocket client (rather than maintaining
      // one from a stale client).
      if (this._removeMessageEventListener) {
        this._removeMessageEventListener();
      }

      this._removeMessageEventListener = socket.addMessageEventListener(event => this.handleMessageEvent(event));

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
        dataset.setUnreadCount(count);
      }
    }
  }

  /**
   * Add a datastore listener, whose callbacks will be called in response to various message events.
   * @param listener - The listener instance to add
   */
  public addDataStoreListener(listener: CourierInboxDataStoreListener): void {
    this._listeners.push(listener);

    for (let dataset of this._datasets.values()) {
      dataset.addDatastoreListener(listener);
    }
  }

  /**
   * Remove a datastore listener.
   * @param listener - The listener instance to remove
   */
  public removeDataStoreListener(listener: CourierInboxDataStoreListener): void {
    this._listeners = this._listeners.filter(l => l !== listener);

    for (let dataset of this._datasets.values()) {
      dataset.removeDatastoreListener(listener);
    }
  }

  /**
   * Mark a message as read.
   * @param message - The message to mark as read
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async readMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't mark as read if already read
    if (message.read) {
      return;
    }

    const beforeMessage = this._globalMessages.get(message.messageId);
    if (!beforeMessage) {
      return;
    }

    await this.executeWithRollback(async () => {
      // Mutate in global store
      const afterMessage = { ...beforeMessage, read: CourierInboxDatastore.getISONow() };
      this._globalMessages.set(message.messageId, afterMessage);

      // Update all datasets
      this.upsertMessage(beforeMessage, afterMessage);

      if (canCallApi) {
        await Courier.shared.client?.inbox.read({ messageId: message.messageId });
      }
    });
  }

  /**
   * Mark a message as unread.
   * @param message - The message to mark as unread
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async unreadMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't mark as unread if already unread
    if (!message.read) {
      return;
    }

    const beforeMessage = this._globalMessages.get(message.messageId);
    if (!beforeMessage) {
      return;
    }

    await this.executeWithRollback(async () => {
      // Mutate in global store
      const afterMessage = { ...beforeMessage, read: undefined };
      this._globalMessages.set(message.messageId, afterMessage);

      // Update all datasets
      this.upsertMessage(beforeMessage, afterMessage);

      if (canCallApi) {
        await Courier.shared.client?.inbox.unread({ messageId: message.messageId });
      }
    });
  }

  /**
   * Mark a message as opened.
   * @param message - The message to mark as opened
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async openMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't mark as opened if already opened
    if (message.opened) {
      return;
    }

    const beforeMessage = this._globalMessages.get(message.messageId);
    if (!beforeMessage) {
      return;
    }

    await this.executeWithRollback(async () => {
      // Mutate in global store
      const afterMessage = { ...beforeMessage, opened: CourierInboxDatastore.getISONow() };
      this._globalMessages.set(message.messageId, afterMessage);

      // Update all datasets
      this.upsertMessage(beforeMessage, afterMessage);

      if (canCallApi) {
        await Courier.shared.client?.inbox.open({ messageId: message.messageId });
      }
    });
  }

  /**
   * Unarchive a message.
   * @param message - The message to unarchive
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async unarchiveMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't unarchive if already unarchived
    if (!message.archived) {
      return;
    }

    const beforeMessage = this._globalMessages.get(message.messageId);
    if (!beforeMessage) {
      return;
    }

    await this.executeWithRollback(async () => {
      // Mutate in global store
      const afterMessage = { ...beforeMessage, archived: undefined };
      this._globalMessages.set(message.messageId, afterMessage);

      // Update all datasets
      this.upsertMessage(beforeMessage, afterMessage);

      if (canCallApi) {
        await Courier.shared.client?.inbox.unarchive({ messageId: message.messageId });
      }
    });
  }

  /**
   * Archive a message.
   * @param message - The message to archive
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async archiveMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Don't archive if already archived
    if (message.archived) {
      return;
    }

    const beforeMessage = this._globalMessages.get(message.messageId);
    if (!beforeMessage) {
      return;
    }

    await this.executeWithRollback(async () => {
      // Mutate in global store
      const afterMessage = { ...beforeMessage, archived: CourierInboxDatastore.getISONow() };
      this._globalMessages.set(message.messageId, afterMessage);

      // Update all datasets
      this.upsertMessage(beforeMessage, afterMessage);

      if (canCallApi) {
        await Courier.shared.client?.inbox.archive({ messageId: message.messageId });
      }
    });
  }

  /**
   * Track a click event for a message.
   * @param message - The message that was clicked
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async clickMessage({ message, canCallApi = true }: { message: InboxMessage; canCallApi?: boolean }): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    // Clicking a message does not mutate it locally, but we still want error handling
    if (message.trackingIds?.clickTrackingId && canCallApi) {
      try {
        await Courier.shared.client?.inbox.click({
          messageId: message.messageId,
          trackingId: message.trackingIds.clickTrackingId
        });
      } catch (error) {
        // Log error
        Courier.shared.client?.options.logger?.error(`[${CourierInboxDatastore.TAG}] Error clicking message:`, error);

        // Notify listeners of error
        this._listeners.forEach(listener => {
          listener.events.onError?.(error as Error);
        });

        // Do NOT re-throw - swallow the error for backward compatibility
      }
    }
  }

  /**
   * Archive all messages for the specified dataset.
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async archiveAllMessages({ canCallApi = true }: { canCallApi?: boolean } = {}): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    await this.executeWithRollback(async () => {
      const archiveDate = CourierInboxDatastore.getISONow();

      // Mutate all messages in global store that aren't already archived
      for (const [messageId, beforeMessage] of this._globalMessages.entries()) {
        if (!beforeMessage.archived) {
          const afterMessage = { ...beforeMessage, archived: archiveDate };
          this._globalMessages.set(messageId, afterMessage);
          this.upsertMessage(beforeMessage, afterMessage);
        }
      }

      if (canCallApi) {
        await Courier.shared.client?.inbox.archiveAll();
      }
    });
  }

  /**
   * Mark all messages read across all datasets.
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async readAllMessages({ canCallApi = true }: { canCallApi?: boolean } = {}): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    await this.executeWithRollback(async () => {
      const readDate = CourierInboxDatastore.getISONow();

      // Mutate all messages in global store that aren't already read
      for (const [messageId, beforeMessage] of this._globalMessages.entries()) {
        if (!beforeMessage.read) {
          const afterMessage = { ...beforeMessage, read: readDate };
          this._globalMessages.set(messageId, afterMessage);
          this.upsertMessage(beforeMessage, afterMessage);
        }
      }

      if (canCallApi) {
        await Courier.shared.client?.inbox.readAll();
      }
    });
  }

  /**
   * Archive all read messages for the specified dataset.
   * @param canCallApi - This parameter is deprecated and will be removed in a future version.
   */
  public async archiveReadMessages({ canCallApi = true }: { canCallApi?: boolean } = {}): Promise<void> {
    if (canCallApi !== undefined && canCallApi !== true) {
      Courier.shared.client?.options.logger?.warn(`[${CourierInboxDatastore.TAG}] canCallApi is deprecated and will be removed in a future version.`);
    }

    await this.executeWithRollback(async () => {
      const archiveDate = CourierInboxDatastore.getISONow();

      // Mutate all read messages in global store that aren't already archived
      for (const [messageId, beforeMessage] of this._globalMessages.entries()) {
        if (beforeMessage.read && !beforeMessage.archived) {
          const afterMessage = { ...beforeMessage, archived: archiveDate };
          this._globalMessages.set(messageId, afterMessage);
          this.upsertMessage(beforeMessage, afterMessage);
        }
      }

      if (canCallApi) {
        await Courier.shared.client?.inbox.archiveRead();
      }
    });
  }

  /**
   * Load datasets from the backend.
   *
   * Props:
   *  - canUseCache: If true and the dataset has already been loaded once, this will return the dataset from memory.
   *  - datasetIds: Optional: The set of dataset IDs to load. If unset, all known datasets will be loaded.
   *
   * @param props - Options to load datasets, see method documentation
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
    await Promise.all(props.datasets.map(async (dataset) => {
      await dataset.loadDataset(props.canUseCache);
      // Sync loaded messages to global store
      this.syncDatasetMessagesToGlobalStore(dataset);
    }));
  }

  /**
   * Sync messages from a dataset to the global message store.
   * This is called after datasets load messages to ensure the global store has all messages.
   */
  private syncDatasetMessagesToGlobalStore(dataset: CourierInboxDataset): void {
    const datasetState = dataset.toInboxDataset();
    for (const message of datasetState.messages) {
      // Only add if not already in global store (don't overwrite)
      if (!this._globalMessages.has(message.messageId)) {
        this._globalMessages.set(message.messageId, message);
      }
    }
  }

  /**
   * Fetch the next page of messages for the specified feed or datasetId.
   *
   * feedType is deprecated and will be removed in the next major release.
   * Please migrate to pass the same identifier as datasetId.
   * While both options are present, exactly one is required.
   *
   * @param props - Options to fetch the next page of messages, see method documetation
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

  /** Get the total unread count across all datasets. */
  public get totalUnreadCount(): number {
    let unreadCount = 0;
    for (let dataset of this._datasets.values()) {
      unreadCount += dataset.unreadCount;
    }

    return unreadCount;
  }

  /**
   * Get the {@link InboxDataSet} representation of the dataset ID specified.
   * @param datasetId - The dataset ID to get
   */
  public getDatasetById(datasetId: string): InboxDataSet | undefined {
    return this._datasets.get(datasetId)?.toInboxDataset();
  }

  /**
   * Get the 'inbox' dataset, or an default instance of {@link InboxDataSet} if it doesn't exist.
   *
   * @deprecated - Update callers to use `getDatasetById('inbox')`
   */
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

  /**
   * Get the 'archive' dataset, or an default instance of {@link InboxDataSet} if it doesn't exist.
   *
   * @deprecated - Update callers to use `getDataSetById('archive')`
   */
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

  /**
   * Get sum of unread counts across all datasets.
   *
   * @deprecated - Update callers to use {@link CourierInboxDatastore.totalUnreadCount} or for a specific dataset {@link CourierInboxDatastore.getDatasetById} which exposes a specific dataset's unread count.
   */
  public get unreadCount(): number {
    return this.totalUnreadCount;
  }

  private async fetchNextPageForDataset(props: { dataset: CourierInboxDataset }): Promise<InboxDataSet | null> {
    const result = await props.dataset.fetchNextPageOfMessages();
    if (result) {
      // Sync newly loaded messages to global store
      this.syncDatasetMessagesToGlobalStore(props.dataset);
    }
    return result;
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

  /**
   * Update all messages across all datasets from an InboxMessageEvent.
   * This only handles InboxMessageEvents that do not specify a messageId
   * and mutate all messages.
   *
   * Related: {@link CourierInboxDatastore.updateMessage}
   */
  private updateAllMessages(event: InboxMessageEvent) {
    const timestamp = CourierInboxDatastore.getISONow();

    for (const [messageId, beforeMessage] of this._globalMessages.entries()) {
      let afterMessage: InboxMessage | null = null;

      switch (event) {
        case InboxMessageEvent.MarkAllRead:
          if (!beforeMessage.read) {
            afterMessage = { ...beforeMessage, read: timestamp };
          }
          break;
        case InboxMessageEvent.ArchiveAll:
          if (!beforeMessage.archived) {
            afterMessage = { ...beforeMessage, archived: timestamp };
          }
          break;
        case InboxMessageEvent.ArchiveRead:
          if (beforeMessage.read && !beforeMessage.archived) {
            afterMessage = { ...beforeMessage, archived: timestamp };
          }
          break;
        default:
          break;
      }

      if (afterMessage) {
        this._globalMessages.set(messageId, afterMessage);
        this.upsertMessage(beforeMessage, afterMessage);
      }
    }
  }

  /**
   * Update a single message across all datasets from an InboxMessageEvent.
   * This only handles InboxMessageEvents that specify a messageId.
   *
   * Related: {@link CourierInboxDatastore.updateAllMessages}
   */
  private updateMessage(messageId: string, event: InboxMessageEvent) {
    // Get the message from global store
    const beforeMessage = this._globalMessages.get(messageId);
    if (!beforeMessage) {
      return;
    }

    let afterMessage: InboxMessage;

    switch (event) {
      case InboxMessageEvent.Archive:
        afterMessage = { ...beforeMessage, archived: CourierInboxDatastore.getISONow() };
        break;
      case InboxMessageEvent.Opened:
        afterMessage = { ...beforeMessage, opened: CourierInboxDatastore.getISONow() };
        break;
      case InboxMessageEvent.Read:
        afterMessage = { ...beforeMessage, read: CourierInboxDatastore.getISONow() };
        break;
      case InboxMessageEvent.Unarchive:
        afterMessage = { ...beforeMessage, archived: undefined };
        break;
      case InboxMessageEvent.Unread:
        afterMessage = { ...beforeMessage, read: undefined };
        break;
      case InboxMessageEvent.Clicked:
      case InboxMessageEvent.Unopened:
      default:
        return;
    }

    // Update global store and propagate to datasets
    this._globalMessages.set(messageId, afterMessage);
    this.upsertMessage(beforeMessage, afterMessage);
  }

  private clearDatasets() {
    this._datasets.clear();
  }

  private static getISONow(): string {
    return new Date().toISOString();
  }

  /**
   * Create a snapshot of all datasets for rollback purposes.
   * This captures the current state of all messages and metadata.
   */
  private createDatastoreSnapshot(): DatastoreSnapshot {
    const snapshots: DatasetSnapshot[] = [];

    for (const [id, dataset] of this._datasets.entries()) {
      const datasetState = dataset.toInboxDataset();
      if (datasetState) {
        const copy = copyInboxDataSet(datasetState);
        if (copy) {
          snapshots.push({
            id,
            dataset: copy
          });
        }
      }
    }

    return { datasets: snapshots };
  }

  /**
   * Restore all datasets from a snapshot, reverting any mutations.
   * This is used for rollback when API calls or updates to downstream datasets fail.
   */
  private restoreDatastoreSnapshot(snapshot: DatastoreSnapshot): void {
    for (const datasetSnapshot of snapshot.datasets) {
      const dataset = this._datasets.get(datasetSnapshot.id);
      if (dataset) {
        dataset.restoreFromSnapshot(datasetSnapshot.dataset);
      }
    }
  }

  /**
   * Execute an operation with automatic rollback on failure.
   * Snapshots all datasets before the operation and restores them if the operation throws.
   *
   * Note: Errors are caught and logged, but not re-thrown to match the behavior
   * for backwards compatibility with the legacy (inbox/archive) datastore implementation.
   *
   * Note: This method exists at the datastore level (rather than dataset) to handle
   * errors from API calls.
   */
  private async executeWithRollback<T>(
    operation: () => Promise<T>
  ): Promise<T | void> {
    const snapshot = this.createDatastoreSnapshot();

    try {
      return await operation();
    } catch (error) {
      Courier.shared.client?.options.logger?.error(`[${CourierInboxDatastore.TAG}] Error during operation:`, error);

      this.restoreDatastoreSnapshot(snapshot);

      this._listeners.forEach(listener => {
        listener.events.onError?.(error as Error);
      });
    }
  }

  /**
   * Get the shared instance of CourierInboxDatastore.
   *
   * CourierInboxDatastore is a singleton. Instance methods should be accessed
   * through this `shared` static accessor.
   */
  public static get shared(): CourierInboxDatastore {
    if (!CourierInboxDatastore.instance) {
      CourierInboxDatastore.instance = new CourierInboxDatastore();
    }
    return CourierInboxDatastore.instance;
  }

}
