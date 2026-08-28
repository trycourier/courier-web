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

/**
 * How an action renders.
 *
 * `secondary` and `tertiary` are the outlined looks the email renderer draws, taking both the
 * outline and the label from `background_color`.
 *
 * Two things about this field are worth knowing. A plain filled button arrives as `undefined`,
 * not `'button'` — the sender omits the value when it equals `button` — so an absent style is
 * the filled case. And nothing validates it in transit, so a value outside this list can
 * arrive; the union names what is understood, not what is possible.
 */
export type InboxActionStyle = 'button' | 'link' | 'secondary' | 'tertiary' | (string & {});

/** Horizontal placement of an action within its row. */
export type InboxActionAlign = 'left' | 'center' | 'right' | 'full';

/**
 * An action attached to a message.
 *
 * The styling fields mirror the Elemental `action` element, so whatever a template author
 * configures — fill color, outline, corner radius, padding — arrives here untouched and can
 * be rendered to match the template preview.
 */
export interface InboxAction {
  content?: string;
  href?: string;
  data?: Record<string, any>;
  /** Identifier a template author can attach to the action to tell it apart from the others. */
  action_id?: string;
  /**
   * Surfaced as data only — the built-in list item lays actions out in a row and does not
   * position by it. A custom list item can read it.
   */
  align?: InboxActionAlign;
  background_color?: string;
  /** CSS length, e.g. `'4px'`. */
  border_radius?: string;
  /** CSS length, e.g. `'1px'`. */
  border_size?: string;
  /** CSS length, e.g. `'14px'`. */
  font_size?: string;
  /** CSS shorthand, e.g. `'8px 16px'`. */
  padding?: string;
  style?: InboxActionStyle;
  disable_tracking?: boolean;
  /**
   * Text color.
   *
   * @deprecated Not part of the Elemental action element. Older templates still emit it, so it
   * is honored when present; otherwise a readable color is derived from `background_color`.
   */
  color?: string;
  /**
   * @deprecated Superseded by the flat `border_size` / `border_radius` fields. The designer
   * still writes it, so it is honored when the flat fields are absent — though the send
   * pipeline currently drops it before delivery.
   */
  border?: {
    enabled?: boolean;
    color?: string;
    /** Either a CSS length (`'4px'`) or a bare number of pixels. */
    radius?: string | number;
    size?: string;
  };
}

export interface InboxMessage {
  messageId: string;
  /** The account / sub-tenant this message is scoped to, if any. */
  accountId?: string;
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
