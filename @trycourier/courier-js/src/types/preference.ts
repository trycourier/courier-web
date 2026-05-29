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
  digestSchedule?: string;
}

export interface CourierUserPreferences {
  items: CourierUserPreferencesTopic[];
  paging: CourierUserPreferencesPaging;
}

export interface CourierUserPreferencesTopicResponse {
  topic: CourierUserPreferencesTopic;
}

export interface CourierDigestScheduleOption {
  scheduleId: string;
  period?: string;
  recurrence?: string;
  repeat?: Record<string, unknown>;
  repetition?: string;
  start?: string;
  default?: boolean;
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

/**
 * A channel label mapping for the preference page.
 */
export interface CourierPreferencePageChannelLabel {
  channel: CourierUserPreferencesChannel;
  name: string;
}

export interface CourierPreferencePageChannelConfigs {
  channelLabels: CourierPreferencePageChannelLabel[];
}

/**
 * A topic as published in the preference page (workspace-configured metadata
 * such as default status and digest schedules), without the user's current
 * preference values.
 */
export interface CourierPreferencePageTopic {
  templateId: string;
  templateName: string;
  defaultStatus: CourierUserPreferencesStatus;
  data?: unknown;
  digestSchedules?: CourierDigestScheduleOption[];
}

/**
 * A section as published in the preference page, including section-level
 * routing configuration.
 */
export interface CourierPreferencePageSection {
  sectionId: string;
  name: string;
  hasCustomRouting: boolean;
  routingOptions: CourierUserPreferencesChannel[];
  topics: CourierPreferencePageTopic[];
}

/**
 * Brand metadata returned inline on the preference page query (a subset of
 * `CourierBrand`).
 */
export interface CourierPreferencePageBrand {
  settings?: {
    colors?: {
      primary?: string;
    };
  };
  logo?: {
    href?: string;
    image?: string;
  } | null;
  links?: Record<string, unknown> | null;
}

/**
 * Full result of the `preferencePage` GraphQL query: workspace-configured
 * sections, topics, channel labels and brand info. Combine with
 * `getUserPreferences()` to get the user's current per-topic state.
 */
export interface CourierPreferencePage {
  showCourierFooter: boolean;
  brand?: CourierPreferencePageBrand | null;
  channelConfigs?: CourierPreferencePageChannelConfigs | null;
  sections: CourierPreferencePageSection[];
}