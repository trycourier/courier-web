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
  /**
   * IANA timezone (e.g. "America/New_York") the schedule's time is expressed in.
   * When present, the time is rendered in this zone (DST-aware, matching the
   * editor + backend); when absent, `start` is treated as a UTC time-of-day.
   */
  timezone?: string;
}
