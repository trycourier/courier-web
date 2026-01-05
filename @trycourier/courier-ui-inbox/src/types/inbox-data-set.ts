import { InboxMessage } from "@trycourier/courier-js";

export type InboxDataSet = {
  id: string;
  messages: InboxMessage[];
  unreadCount: number;
  canPaginate: boolean;
  paginationCursor: string | null;
};

/**
 * The set of message filters.
 *
 * Filters are AND'd together to produce a set of messages.
 * For example, if the filter is `{ archived: true, status: 'read' }`
 * the filter will produce messages that are archived AND read.
 */
export type CourierInboxDatasetFilter = {
  /**
   * The set of tags to match to a message's tags. If a message has any of the tags,
   * the message will be included in the dataset.
   */
  tags?: string[];

  /** Whether to include archived messages. Defaults to false if unset. */
  archived?: boolean;

  /* Whether to limit messages to those that are read or unread. Undefined applies no state filter. */
  status?: 'read' | 'unread';
}

/**
 * A tab represents a filtered view of messages within a feed.
 *
 * Each tab corresponds to a dataset in the CourierInboxDatastore. When feeds are
 * registered via `CourierInboxDatastore.registerFeeds()`, each tab's `datasetId`
 * is used to create a dataset that applies the tab's filter to the message store.
 * This dataset ID is then used throughout the system to:
 * - Identify which dataset a tab displays
 * - Match datastore events (message add/remove/update, unread count changes) to their corresponding tabs
 * - Programmatically select tabs via `CourierInbox.selectTab()`
 * - Fetch paginated messages for a specific tab
 * - Update unread count badges on tabs
 *
 * @example
 * ```typescript
 * {
 *   datasetId: 'inbox',  // Used to create and reference the dataset in the datastore and to select the tab
 *   title: 'Inbox',      // Display name shown in the UI
 *   filter: {}           // No filter = all unarchived messages
 * }
 * ```
 */
export type CourierInboxTab = {
  /**
   * The unique identifier that links this tab to its corresponding dataset in the datastore.
   *
   * This ID is used as the key when creating datasets from feeds, and must be unique
   * across all tabs in all feeds. It's recommended to use a slug-ified version of the
   * tab's title (e.g., `'my-tab'` for title `"My Tab"`).
   *
   * When a tab is selected, this ID is used to:
   * - Load messages from the corresponding dataset via `CourierInboxDatastore.getDatasetById()`
   * - Listen for datastore events specific to this dataset
   * - Update the tab's unread count badge when the dataset's unread count changes
   */
  datasetId: string;

  /** The display name for this tab. */
  title: string;

  /** The message filters to apply to this tab. */
  filter: CourierInboxDatasetFilter;
}

/**
 * A feed is a container that groups related tabs together in the inbox UI.
 *
 * Feeds provide a way to organize tabs into logical sections (e.g., "Inbox", "Archive", "Notifications").
 * Each feed appears as a selectable option in the inbox header, and when selected, displays its
 * associated tabs. When feeds are registered via `CourierInboxDatastore.registerFeeds()`, all tabs
 * from all feeds are flattened and used to create datasets in the datastore. The feed itself doesn't
 * create a dataset - only the tabs within it do.
 *
 * The `feedId` is used throughout the system to:
 * - Programmatically select feeds via `CourierInbox.selectFeed()`
 * - Track which feed is currently active in the inbox
 * - Map feeds to their default (first) tab for navigation
 * - Display feeds in the header UI with selection state
 * - Validate that tabs belong to the current feed when selecting them
 *
 * @example
 * ```typescript
 * {
 *   feedId: 'inbox',           // Used to select and identify this feed
 *   title: 'Inbox',            // Display name shown in the header
 *   iconSVG: '<svg>...</svg>', // Optional icon for the feed button
 *   tabs: [
 *     { datasetId: 'inbox', title: 'Inbox', filter: {} },
 *     { datasetId: 'unread', title: 'Unread', filter: { status: 'unread' } }
 *   ]
 * }
 * ```
 */
export type CourierInboxFeed = {
  /**
   * The unique identifier for this feed, used to programmatically select and reference it.
   *
   * This ID must be unique among all feeds. It's used to:
   * - Select feeds programmatically via `CourierInbox.selectFeed(feedId)`
   * - Track the currently active feed in the inbox component
   * - Map feeds to their default tabs for navigation
   * - Display feeds in the header with proper selection state
   * - Validate tab selections (ensuring tabs belong to the current feed)
   *
   * It's recommended to use a slug-ified version of the feed's title
   * (e.g., `'my-inbox'` for title `"My Inbox"`).
   */
  feedId: string;

  /** The display name for this feed. */
  title: string;

  /** The icon for this feed as an SVG. */
  iconSVG?: string;

  /** The tabs that make up this feed. */
  tabs: CourierInboxTab[];
}
