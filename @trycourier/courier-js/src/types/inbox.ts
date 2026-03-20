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

export interface InboxMessage {
  messageId: string;
  title?: string;
  body?: string;
  preview?: string;
  actions?: InboxAction[];
  data?: Record<string, any>;
  created?: string;
  archived?: string;
  read?: string;
  opened?: string;
  tags?: string[];
  trackingIds?: {
    archiveTrackingId?: string;
    openTrackingId?: string;
    clickTrackingId?: string;
    deliverTrackingId?: string;
    unreadTrackingId?: string;
    readTrackingId?: string;
  };
}

export interface CourierGetInboxMessageResponse {
  message: InboxMessage;
}
