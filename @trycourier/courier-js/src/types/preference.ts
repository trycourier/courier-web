export type CourierUserPreferencesStatus = 'OPTED_IN' | 'OPTED_OUT' | 'REQUIRED' | 'UNKNOWN';

export type CourierUserPreferencesChannel = 'direct_message' | 'email' | 'push' | 'sms' | 'webhook' | 'unknown';

export interface CourierUserPreferencesPaging {
  cursor?: string;
  more: boolean;
}

export interface CourierUserPreferencesTopic {
  topicId: string;
  topicName: string;
  sectionId: string;
  sectionName: string;
  status: CourierUserPreferencesStatus;
  defaultStatus: CourierUserPreferencesStatus;
  hasCustomRouting: boolean;
  customRouting: CourierUserPreferencesChannel[];
}

export interface CourierUserPreferences {
  items: CourierUserPreferencesTopic[];
  paging: CourierUserPreferencesPaging;
}

export interface CourierUserPreferencesTopicResponse {
  topic: CourierUserPreferencesTopic;
}

export class PreferenceTransformer {
  /**
   * Transforms a single API response item to the CourierUserPreferencesTopic type
   * @param item - The API response item
   * @returns A CourierUserPreferencesTopic object
   */
  transformItem(item: any): CourierUserPreferencesTopic {
    return {
      topicId: item.topic_id,
      topicName: item.topic_name,
      sectionId: item.section_id,
      sectionName: item.section_name,
      status: item.status,
      defaultStatus: item.default_status,
      hasCustomRouting: item.has_custom_routing,
      customRouting: item.custom_routing || []
    };
  }

  /**
   * Transforms an array of API response items to CourierUserPreferencesTopic objects
   * @param items - The API response items
   * @returns A generator of CourierUserPreferencesTopic objects
   */
  *transform(items: any[]): Generator<CourierUserPreferencesTopic> {
    for (const item of items) {
      yield this.transformItem(item);
    }
  }
}