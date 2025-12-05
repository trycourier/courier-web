import { InboxMessage } from "@trycourier/courier-js";
import { CourierIconTheme } from "@trycourier/courier-ui-core";

export type InboxDataSet = {
  feedType: string;
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

/** A tab is a filtered set of messages. */
export type CourierInboxTab = {
  /**
   * The unique ID for this tab, which will be included in datastore events
   * and can be used to programmatically select the tab.
   *
   * Must be unique among tabs. Consider using the slug-ified version of the label,
   * ex. id 'my-tab' for label "My Tab".
   */
  id: string;

  /** The display name for this tab. */
  title: string;

  /** The message filters to apply to this tab. */
  filter: CourierInboxDatasetFilter;
}

/** One or more groups of tabs is a feed. */
export type CourierInboxFeed = {
  /**
   * The unique ID for this feed, which can be used to programmatically select the feed.
   *
   * Must be unique among feeds. Consider using the slug-ified version of the label,
   * ex. id 'my-inbox' for label "My Inbox".
   */
  id: string;

  /** The display name for this feed. */
  title: string;

  /** The icon for this feed. */
  icon?: CourierIconTheme;

  /** The tabs that make up this feed. */
  tabs: CourierInboxTab[];
}
