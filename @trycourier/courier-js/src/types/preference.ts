export type CourierUserPreferencesStatus = 'OPTED_IN' | 'OPTED_OUT' | 'REQUIRED' | 'UNKNOWN';

export type CourierUserPreferencesChannel = 'direct_message' | 'inbox' | 'email' | 'push' | 'sms' | 'webhook' | 'unknown';

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

/**
 * GraphQL response type for recipient preference nodes
 * @internal
 */
export interface RecipientPreference {
  templateId: string;
  templateName?: string;
  status?: string;
  hasCustomRouting?: boolean;
  routingPreferences?: string[];
  digestSchedule?: string;
  sectionId?: string;
  sectionName?: string;
  defaultStatus?: string;
}