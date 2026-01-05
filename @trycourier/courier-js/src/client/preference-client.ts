import { CourierUserPreferences, CourierUserPreferencesChannel, CourierUserPreferencesStatus, CourierUserPreferencesTopic, CourierUserPreferencesTopicResponse, PreferenceTransformer } from '../types/preference';
import { decode, encode } from '../utils/coding';
import { http } from '../utils/request';
import { Client } from './client';

export class PreferenceClient extends Client {
  private transformer = new PreferenceTransformer();

  /**
   * Get all preferences for a user
   * @param paginationCursor - Optional cursor for pagination
   * @returns Promise resolving to user preferences
   * @see https://www.courier.com/docs/api-reference/user-preferences/get-user-preferences
   */
  public async getUserPreferences(props?: { paginationCursor?: string; }): Promise<CourierUserPreferences> {
    let url = `${this.options.apiUrls.courier.rest}/users/${this.options.userId}/preferences`;

    if (props?.paginationCursor) {
      url += `?cursor=${props.paginationCursor}`;
    }

    const json = await http({
      options: this.options,
      url,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const data = json as CourierUserPreferences;

    return {
      items: [...this.transformer.transform(data.items)],
      paging: data.paging
    };
  }

  /**
   * Get preferences for a specific topic
   * @param topicId - The ID of the topic to get preferences for
   * @returns Promise resolving to topic preferences
   * @see https://www.courier.com/docs/api-reference/user-preferences/get-user-subscription-topic
   */
  public async getUserPreferenceTopic(props: { topicId: string; }): Promise<CourierUserPreferencesTopic> {

    const json = await http({
      options: this.options,
      url: `${this.options.apiUrls.courier.rest}/users/${this.options.userId}/preferences/${props.topicId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const res = json as CourierUserPreferencesTopicResponse;
    return this.transformer.transformItem(res.topic);
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

    const payload = {
      topic: {
        status: props.status,
        has_custom_routing: props.hasCustomRouting,
        custom_routing: props.customRouting,
      },
    };

    await http({
      options: this.options,
      url: `${this.options.apiUrls.courier.rest}/users/${this.options.userId}/preferences/${props.topicId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      body: payload,
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

}
