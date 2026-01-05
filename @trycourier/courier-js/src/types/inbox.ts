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

export interface CourierGetInboxMessagesQueryFilter {
  tags?: string[];
  archived?: boolean;
  status?: 'read' | 'unread';
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
