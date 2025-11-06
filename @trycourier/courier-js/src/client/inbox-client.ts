import { CourierInboxSocket } from '../socket/courier-inbox-socket';
import { CourierGetInboxMessagesQueryFilter, CourierGetInboxMessagesResponse } from '../types/inbox';
import { graphql } from '../utils/request';
import { Client } from './client';
import { CourierClientOptions } from './courier-client';

export class InboxClient extends Client {

  readonly socket: CourierInboxSocket;

  constructor(options: CourierClientOptions) {
    super(options);
    this.socket = new CourierInboxSocket(options);
  }

  /**
   * Get paginated messages
   * @param paginationLimit - Number of messages to return per page (default: 24)
   * @param startCursor - Cursor for pagination
   * @returns Promise resolving to paginated messages response
   */
  public async getMessages(props?: {
    paginationLimit?: number;
    startCursor?: string;
    filter?: CourierGetInboxMessagesQueryFilter;
  }): Promise<CourierGetInboxMessagesResponse> {
    const filter = props?.filter || {};
    const filterParams = this.createFilterParams(filter);
    const unreadCountFilterParams = this.createUnreadCountFilterParams(filter)

    const query = `
      query GetInboxMessages(
        $params: FilterParamsInput = ${filterParams}
        $unreadCountParams: FilterParamsInput = ${unreadCountFilterParams}
        $limit: Int = ${props?.paginationLimit ?? 24}
        $after: String ${props?.startCursor ? `= "${props.startCursor}"` : ''}
      ) {
        count: count(params: $params)
        unreadCount: count(params: $unreadCountParams)
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Get paginated archived messages
   * @param paginationLimit - Number of messages to return per page (default: 24)
   * @param startCursor - Cursor for pagination
   * @returns Promise resolving to paginated archived messages response
   */
  public async getArchivedMessages(props?: { paginationLimit?: number; startCursor?: string; }): Promise<CourierGetInboxMessagesResponse> {
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Get unread message count
   * @returns Promise resolving to number of unread messages
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
      url: this.options.apiUrls.inbox.graphql,
    });

    return response.data?.count ?? 0;
  }

  /**
   * Track a click event
   * @param messageId - ID of the message
   * @param trackingId - ID for tracking the click
   * @returns Promise resolving when click is tracked
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Mark a message as read
   * @param messageId - ID of the message to mark as read
   * @returns Promise resolving when message is marked as read
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Mark a message as unread
   * @param messageId - ID of the message to mark as unread
   * @returns Promise resolving when message is marked as unread
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Mark a message as opened
   * @param messageId - ID of the message to mark as opened
   * @returns Promise resolving when message is marked as opened
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Archive a message
   * @param messageId - ID of the message to archive
   * @returns Promise resolving when message is archived
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Unarchive a message
   * @param messageId - ID of the message to unarchive
   * @returns Promise resolving when message is unarchived
   */
  public async unarchive(props: { messageId: string }): Promise<void> {
    const query = `
      mutation TrackEvent {
        unarchive(messageId: "${props.messageId}")
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Mark all messages as read
   * @returns Promise resolving when all messages are marked as read
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Archive all read messages.
   */
  public async archiveRead(): Promise<void> {
    const query = `
      mutation TrackEvent {
        archiveRead
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Archive all read messages.
   */
  public async archiveAll(): Promise<void> {
    const query = `
      mutation TrackEvent {
        archiveAll
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
      url: this.options.apiUrls.inbox.graphql,
    });
  }

  /**
   * Create FilterParamsInput for the given filters.
   *
   * @param filter the filtering options to include in the output
   * @returns the FilterParamsInput to pass to a GraphQL query for messages
   */
  private createFilterParams(filter: CourierGetInboxMessagesQueryFilter) {
    const parts = []

    if (this.options.tenantId) {
      parts.push(`accountId: "${this.options.tenantId}"`);
    }

    if (filter.tags) {
      parts.push(`tags: ${filter.tags}`);
    }

    if (filter.status) {
      parts.push(`status: "${filter.status}"`);
    }

    if (filter.archived) {
      parts.push(`archived: ${filter.archived}`);
    }

    return `{ ${parts.join(',')} }`;
  }

  /**
   * Create FilterParamsInput for the unread message count.
   *
   * The status: "unread" filter is only added if status is unset. This is because:
   *  - If status is "unread", the params already include the filter that would be added.
   *  - If status is "read", the unread count for the dataset would be a different set
   *    of messages rather than a count of the unread subset.
   */
  private createUnreadCountFilterParams(filter: CourierGetInboxMessagesQueryFilter) {
    if (!filter.status) {
      return this.createFilterParams({ ...filter, status: 'unread' });
    }

    return this.createFilterParams(filter);
  }

}
