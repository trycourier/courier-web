import { InboxSocket } from '../socket/inbox-socket';
import { CourierGetInboxMessagesResponse } from '../types/inbox';
import { graphql } from '../utils/request';
import { Client } from './client';
import { CourierClientOptions } from './courier-client';

export class InboxClient extends Client {

  readonly socket: InboxSocket;

  constructor(options: CourierClientOptions) {
    super(options);
    this.socket = new InboxSocket(options);
  }

  /**
   * Get paginated messages
   */
  public async getMessages(props?: {
    paginationLimit?: number;
    startCursor?: string;
  }): Promise<CourierGetInboxMessagesResponse> {
    const query = `
      query GetInboxMessages(
        $params: FilterParamsInput = { ${this.options.tenantId ? `accountId: "${this.options.tenantId}"` : ''} }
        $limit: Int = ${props?.paginationLimit ?? 24}
        $after: String ${props?.startCursor ? `= "${props.startCursor}"` : ''}
      ) {
        count(params: $params)
        messages(params: $params, limit: $limit, after: $after) {
          totalCount
          pageInfo {
            startCursor
            hasNextPage
          }
          nodes {
            messageId
            read
            archived
            created
            opened
            title
            preview
            data
            tags
            trackingIds {
              clickTrackingId
            }
            actions {
              content
              data
              href
            }
          }
        }
      }
    `;

    return await graphql({
      options: this.options,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Get paginated archived messages
   */
  public async getArchivedMessages(props?: {
    paginationLimit?: number;
    startCursor?: string;
  }): Promise<CourierGetInboxMessagesResponse> {
    const query = `
      query GetInboxMessages(
        $params: FilterParamsInput = { ${this.options.tenantId ? `accountId: "${this.options.tenantId}"` : ''}, archived: true }
        $limit: Int = ${props?.paginationLimit ?? 24}
        $after: String ${props?.startCursor ? `= "${props.startCursor}"` : ''}
      ) {
        count(params: $params)
        messages(params: $params, limit: $limit, after: $after) {
          totalCount
          pageInfo {
            startCursor
            hasNextPage
          }
          nodes {
            messageId
            read
            archived
            created
            opened
            title
            preview
            data
            tags
            trackingIds {
              clickTrackingId
            }
            actions {
              content
              data
              href
            }
          }
        }
      }
    `;

    return graphql({
      options: this.options,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Get unread message count
   */
  public async getUnreadMessageCount(): Promise<number> {
    const query = `
      query GetMessages {
        count(params: { status: "unread" ${this.options.tenantId ? `, accountId: "${this.options.tenantId}"` : ''} })
      }
    `;

    const response = await graphql({
      options: this.options,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      url: this.options.urls.inbox.graphql,
    });

    return response.data?.count ?? 0;
  }

  /**
   * Track a click event
   */
  public async click(props: { messageId: string, trackingId: string }): Promise<void> {
    const query = `
      mutation TrackEvent {
        clicked(messageId: "${props.messageId}", trackingId: "${props.trackingId}")
      }
    `;

    const headers: Record<string, string> = {
      'x-courier-user-id': this.options.userId,
      'Authorization': `Bearer ${this.options.accessToken}`
    };

    if (this.options.connectionId) {
      headers['x-courier-client-source-id'] = this.options.connectionId;
    }

    await graphql({
      options: this.options,
      query,
      headers,
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Mark a message as read
   */
  public async read(props: { messageId: string }): Promise<void> {
    const query = `
      mutation TrackEvent {
        read(messageId: "${props.messageId}")
      }
    `;

    const headers: Record<string, string> = {
      'x-courier-user-id': this.options.userId,
      'Authorization': `Bearer ${this.options.accessToken}`
    };

    if (this.options.connectionId) {
      headers['x-courier-client-source-id'] = this.options.connectionId;
    }

    await graphql({
      options: this.options,
      query,
      headers,
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Mark a message as unread
   */
  public async unread(props: { messageId: string }): Promise<void> {
    const query = `
      mutation TrackEvent {
        unread(messageId: "${props.messageId}")
      }
    `;

    const headers: Record<string, string> = {
      'x-courier-user-id': this.options.userId,
      'Authorization': `Bearer ${this.options.accessToken}`
    };

    if (this.options.connectionId) {
      headers['x-courier-client-source-id'] = this.options.connectionId;
    }

    await graphql({
      options: this.options,
      query,
      headers,
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Mark all messages as read
   */
  public async readAll(): Promise<void> {
    const query = `
      mutation TrackEvent {
        markAllRead
      }
    `;

    const headers: Record<string, string> = {
      'x-courier-user-id': this.options.userId,
      'Authorization': `Bearer ${this.options.accessToken}`
    };

    if (this.options.connectionId) {
      headers['x-courier-client-source-id'] = this.options.connectionId;
    }

    await graphql({
      options: this.options,
      query,
      headers,
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Mark a message as opened
   */
  public async open(props: { messageId: string }): Promise<void> {
    const query = `
      mutation TrackEvent {
        opened(messageId: "${props.messageId}")
      }
    `;

    const headers: Record<string, string> = {
      'x-courier-user-id': this.options.userId,
      'Authorization': `Bearer ${this.options.accessToken}`
    };

    if (this.options.connectionId) {
      headers['x-courier-client-source-id'] = this.options.connectionId;
    }

    await graphql({
      options: this.options,
      query,
      headers,
      url: this.options.urls.inbox.graphql,
    });
  }

  /**
   * Archive a message
   */
  public async archive(props: { messageId: string }): Promise<void> {
    const query = `
      mutation TrackEvent {
        archive(messageId: "${props.messageId}")
      }
    `;

    const headers: Record<string, string> = {
      'x-courier-user-id': this.options.userId,
      'Authorization': `Bearer ${this.options.accessToken}`
    };

    if (this.options.connectionId) {
      headers['x-courier-client-source-id'] = this.options.connectionId;
    }

    await graphql({
      options: this.options,
      query,
      headers,
      url: this.options.urls.inbox.graphql,
    });
  }
}
