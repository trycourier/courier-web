import { CourierUserPreferencesStatus, CourierUserPreferencesChannel, CourierDigestScheduleOption } from "@trycourier/courier-js";

/** @public */
export interface PreferencesSection {
  sectionId: string;
  sectionName: string;
  /** Optional workspace-configured description, shown under the section title. */
  description?: string;
  hasCustomRouting: boolean;
  routingOptions: CourierUserPreferencesChannel[];
  topics: PreferencesTopic[];
}

/** @public */
export interface PreferencesTopic {
  topicId: string;
  topicName: string;
  /** Optional workspace-configured description, shown under the topic name. */
  description?: string;
  status: CourierUserPreferencesStatus;
  defaultStatus: CourierUserPreferencesStatus;
  hasCustomRouting: boolean;
  customRouting: CourierUserPreferencesChannel[];
  digestSchedule?: string;
  digestScheduleOptions?: CourierDigestScheduleOption[];
}

/** @public */
export interface DigestSchedule {
  default: boolean;
  period: string;
  recurrence: string;
  repeat?: {
    frequency: number;
    interval: "day" | "week" | "month" | "year";
    on?: string | Record<string, boolean>;
  };
  repetition: string;
  scheduleId: string;
  start: string;
  end?: number | string;
}
