import { CourierUserPreferences, CourierUserPreferencesChannel, CourierUserPreferencesStatus, CourierUserPreferencesTopic, CourierUserPreferencesTopicResponse, PreferenceTransformer } from '../types/preference';
import { http } from '../utils/request';
import { Client } from './client';

export class PreferenceClient extends Client {
  private transformer = new PreferenceTransformer();

  /**
   * Get all preferences for a user
   * @see https://www.courier.com/docs/reference/user-preferences/list-all-user-preferences
   */
  public async getUserPreferences(params?: {
    paginationCursor?: string;
  }): Promise<CourierUserPreferences> {
    let url = `${this.urls.courier.rest}/users/${this.options.userId}/preferences`;

    if (params?.paginationCursor) {
      url += `?cursor=${params.paginationCursor}`;
    }

    const json = await http({
      url,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.options.jwt}`
      },
      options: this.options,
    });

    const data = json as CourierUserPreferences;

    return {
      items: [...this.transformer.transform(data.items)],
      paging: data.paging
    };
  }

  /**
   * Get preferences for a specific topic
   * @see https://www.courier.com/docs/reference/user-preferences/get-subscription-topic-preferences
   */
  public async getUserPreferenceTopic(params: {
    topicId: string;
  }): Promise<CourierUserPreferencesTopic> {

    const json = await http({
      url: `${this.urls.courier.rest}/users/${this.options.userId}/preferences/${params.topicId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.options.jwt}`
      },
      options: this.options,
    });

    const res = json as CourierUserPreferencesTopicResponse;
    return this.transformer.transformItem(res.topic);
  }

  /**
   * Update preferences for a specific topic
   * @see https://www.courier.com/docs/reference/user-preferences/update-subscription-topic-preferences
   */
  public async putUserPreferenceTopic(params: {
    topicId: string;
    status: CourierUserPreferencesStatus;
    hasCustomRouting: boolean;
    customRouting: CourierUserPreferencesChannel[];
  }): Promise<void> {

    const payload = {
      topic: {
        status: params.status,
        has_custom_routing: params.hasCustomRouting,
        custom_routing: params.customRouting,
      },
    };

    await http({
      url: `${this.urls.courier.rest}/users/${this.options.userId}/preferences/${params.topicId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.options.jwt}`
      },
      body: payload,
      options: this.options,
    });
  }
}
