export type ChannelClassification =
  | "direct_message"
  | "email"
  | "push"
  | "sms"
  | "webhook";

export type PreferenceStatus = "OPTED_IN" | "OPTED_OUT" | "REQUIRED";

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

export interface PreferenceTopic {
  defaultStatus: PreferenceStatus;
  templateName: string;
  templateId: string;
  digestSchedules: DigestSchedule[] | null;
}

export interface PreferenceSection {
  name: string;
  sectionId: string;
  routingOptions: ChannelClassification[];
  hasCustomRouting: boolean;
  topics: {
    nodes: PreferenceTopic[];
  };
}

export interface BrandSocialLinks {
  facebook?: { url: string };
  instagram?: { url: string };
  linkedin?: { url: string };
  medium?: { url: string };
  twitter?: { url: string };
}

export interface Brand {
  settings: {
    colors: {
      primary: string;
    };
  };
  links: BrandSocialLinks | null;
  logo: {
    href: string;
    image: string;
  } | null;
}

export interface ChannelLabel {
  channel: ChannelClassification;
  name: string;
}

export interface PreferencePage {
  showCourierFooter: boolean;
  brand: Brand;
  channelConfigs: {
    channelLabels: ChannelLabel[];
  } | null;
  sections: {
    nodes: PreferenceSection[];
  };
}

export interface RecipientPreference {
  templateId: string;
  status: PreferenceStatus;
  hasCustomRouting: boolean;
  routingPreferences: ChannelClassification[];
  digestSchedule: string | null;
}

export type CourierEnv = "production" | "staging" | "dev";

export interface DecodedParams {
  workspaceId: string;
  brandId: string;
  userId: string;
  /** Render the draft preference page instead of the published one (ignored today). */
  draft: boolean;
  accountId: string;
  apiKey: string;
  env: CourierEnv;
}

export interface DecodedUnsubscribeParams {
  workspaceId: string;
  brandId: string;
  userId: string;
  topicId: string;
  list: boolean;
  accountId: string;
  apiKey: string;
  env: CourierEnv;
}

export interface AuthContext {
  apiUrl: string;
  jwt: string;
  clientKey: string;
}
