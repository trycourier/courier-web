import { CourierUserPreferences, CourierUserPreferencesChannel, CourierUserPreferencesStatus, CourierUserPreferencesTopic, RecipientPreference } from '../types/preference';
import { decode, encode } from '../utils/coding';
import { graphql } from '../utils/request';
import { Client } from './client';

export class PreferenceClient extends Client {
  /**
   * Get all preferences for a user
   * @param paginationCursor - Optional cursor for pagination (not used in GraphQL implementation)
   * @returns Promise resolving to user preferences
   */
  public async getUserPreferences(props?: { paginationCursor?: string; }): Promise<CourierUserPreferences> {
    const query = `
      query GetRecipientPreferences {
        recipientPreferences${this.options.tenantId ? `(accountId: "${this.options.tenantId}")` : ''} {
          nodes {
            templateId
            templateName
            sectionId
            sectionName
            defaultStatus
            status
            hasCustomRouting
            routingPreferences
            digestSchedule
          }
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const nodes: RecipientPreference[] = response.data?.recipientPreferences?.nodes || [];

    return {
      items: nodes.map(node => this.transformToTopic(node)),
      paging: {
        cursor: props?.paginationCursor,
        more: false // GraphQL returns all preferences at once
      }
    };
  }

  /**
   * Get preferences for a specific topic
   * @param topicId - The ID of the topic to get preferences for
   * @returns Promise resolving to topic preferences
   * @see https://www.courier.com/docs/api-reference/user-preferences/get-user-subscription-topic
   */
  public async getUserPreferenceTopic(props: { topicId: string; }): Promise<CourierUserPreferencesTopic> {
    const query = `
      query GetRecipientPreferenceTopic {
        recipientPreference(templateId: "${props.topicId}"${this.options.tenantId ? `, accountId: "${this.options.tenantId}"` : ''}) {
          templateId
          templateName
          status
          hasCustomRouting
          routingPreferences
          digestSchedule
          sectionId
          sectionName
          defaultStatus
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const node: RecipientPreference = response.data?.recipientPreference;

    if (!node) {
      throw new Error(`Preference topic not found: ${props.topicId}`);
    }

    return this.transformToTopic(node);
  }

  /**
   * Update preferences for a specific topic
   * @param topicId - The ID of the topic to update preferences for
   * @param status - The new status for the topic
   * @param hasCustomRouting - Whether the topic has custom routing
   * @param customRouting - The custom routing channels for the topic
   * @returns Promise resolving when update is complete
   * @see https://www.courier.com/docs/api-reference/user-preferences/update-or-create-user-preferences-for-subscription-topic
   */
  public async putUserPreferenceTopic(props: { topicId: string; status: CourierUserPreferencesStatus; hasCustomRouting: boolean; customRouting: CourierUserPreferencesChannel[]; }): Promise<void> {
    const routingPreferences = props.customRouting.length > 0
      ? `[${props.customRouting.map(r => `"${r}"`).join(', ')}]`
      : '[]';

    const query = `
      mutation UpdateRecipientPreferences {
        updatePreferences(
          templateId: "${props.topicId}",
          preferences: {
            status: "${props.status}",
            hasCustomRouting: ${props.hasCustomRouting},
            routingPreferences: ${routingPreferences}
          }${this.options.tenantId ? `, accountId: "${this.options.tenantId}"` : ''}
        )
      }
    `;

    await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });
  }

  /**
   * Get the notification center URL
   * @param clientKey - The client key to use for the URL
   * @returns The notification center URL
   */
  public getNotificationCenterUrl(props: {
    clientKey: string;
  }): string {
    const rootTenantId = decode(props.clientKey);
    const url = encode(`${rootTenantId}#${this.options.userId}${this.options.tenantId ? `#${this.options.tenantId}` : ""}#${false}`);
    return `https://view.notificationcenter.app/p/${url}`;
  }

  /**
   * Transform a GraphQL RecipientPreference node to CourierUserPreferencesTopic
   */
  private transformToTopic(node: RecipientPreference): CourierUserPreferencesTopic {
    return {
      topicId: node.templateId,
      topicName: node.templateName || '',
      sectionId: node.sectionId || '',
      sectionName: node.sectionName || '',
      status: (node.status as CourierUserPreferencesStatus) || 'UNKNOWN',
      defaultStatus: (node.defaultStatus as CourierUserPreferencesStatus) || 'UNKNOWN',
      hasCustomRouting: node.hasCustomRouting || false,
      customRouting: (node.routingPreferences || []) as CourierUserPreferencesChannel[]
    };
  }
}
