export interface CourierGetInboxMessagesResponse {
  data?: {
    count?: number;
    unreadCount?: number;
    messages?: {
      pageInfo?: {
        startCursor?: string;
        hasNextPage?: boolean;
      };
      nodes?: InboxMessage[];
    };
  };
}

/**
 * Inbox message query filters. Each field you set narrows the result set; together they act as AND conditions.
 */
export interface CourierGetInboxMessagesQueryFilter {
  /**
   * If set, only messages that have at least one of these tags are returned (tag match is OR within the array).
   */
  tags?: string[];
  /**
   * If `true`, only archived messages are returned. If omitted, the filter does not restrict by archive state
   * and the API uses its default (typically the active inbox, excluding archived).
   */
  archived?: boolean;
  /**
   * If set, only messages in that read state are included. If omitted, both read and unread messages may appear
   * (subject to other filters and API defaults).
   */
  status?: 'read' | 'unread';
  /**
   * Lower bound on message creation time: only messages created at or after this moment are included.
   * Pass an ISO 8601 datetime string (e.g. `new Date().toISOString()`).
   */
  from?: string;
}

export interface InboxAction {
  content?: string;
  href?: string;
  data?: Record<string, any>;
  background_color?: string;
  style?: string;
}

/** Tracking ids for a message. Always at the root of the message — see below. */
export interface InboxMessageTrackingIds {
  archiveTrackingId?: string;
  channelTrackingId?: string;
  clickTrackingId?: string;
  deliverTrackingId?: string;
  openTrackingId?: string;
  readTrackingId?: string;
  unreadTrackingId?: string;
}

/**
 * Rendered message body.
 *
 * Mirrors the GraphQL `FullMessage.content` field. Delivered over the socket on
 * `iwpv=v2`; the GraphQL list query does not return it.
 */
export interface InboxMessageContent {
  html?: string;
  elemental?: unknown[];
}

/**
 * A single inbox message.
 *
 * One shape regardless of how it arrived. A message delivered live over the
 * socket and the same message fetched from GraphQL used to disagree — most
 * visibly `trackingIds`, which the socket nested under `data` while GraphQL
 * returned it at the root. `iwpv=v2` removes that divergence, so `trackingIds` is
 * read from the root and nowhere else.
 */
export interface InboxMessage {
  messageId: string;
  /** The account / sub-tenant this message is scoped to, if any. */
  accountId?: string;
  title?: string;
  body?: string;
  preview?: string;
  actions?: InboxAction[];
  /**
   * Arbitrary key/value data sent with the message.
   *
   * Does **not** contain `trackingIds`, `brandId` or `trackingUrl` — those are
   * promoted to the root, matching how the message is indexed and returned by
   * GraphQL.
   */
  data?: Record<string, any>;
  created?: string;
  archived?: string;
  read?: string;
  opened?: string;
  tags?: string[];
  /** URL of the message icon, if the brand or message specifies one. */
  icon?: string;
  /** Present only when the message is pinned to a slot. */
  pinned?: { slotId?: string };
  /** The user this message belongs to. */
  userId?: string;
  trackingIds?: InboxMessageTrackingIds;
  /** Rendered body. Socket-delivered messages only. */
  content?: InboxMessageContent;
  /** Brand that rendered this message. Promoted out of `data`. */
  brandId?: string;
  /** Channel tracking URL for this message. Promoted out of `data`. */
  trackingUrl?: string;
}

export interface CourierGetInboxMessageResponse {
  message: InboxMessage;
}
