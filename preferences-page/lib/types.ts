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
  env: CourierEnv;
}

export interface DecodedUnsubscribeParams {
  workspaceId: string;
  brandId: string;
  userId: string;
  topicId: string;
  list: boolean;
  accountId: string;
  env: CourierEnv;
}

export interface AuthContext {
  apiUrl: string;
  jwt: string;
  clientKey: string;
}

/**
 * The config object the hosted preferences page authenticates from. This is the
 * exact shape the backend injects as `window.courierConfig`
 * (`backend/client-routes/hosted-preferences.ts` → `getBody()`): the backend
 * decodes the `/p/{base64}` token, mints a user-scoped JWT from the workspace's
 * stored key, and writes these fields. The page never mints — it only reads this.
 *
 * Two sources produce it (see `lib/config.ts` and `lib/dev-config.ts`):
 *   1. production: `window.courierConfig`, set by the backend HTML.
 *   2. local dev:  built from `.env.local` (`COURIER_JWT`, …).
 */
export interface CourierConfig {
  /** User-scoped client JWT (the `Authorization: Bearer` token). */
  authorization: string;
  userId: string;
  /** Optional brand id; empty string when unset. */
  brandId: string;
  /** `base64(workspaceId)`, sent as `x-courier-client-key`. */
  clientKey: string;
  /** GraphQL endpoint, e.g. `https://api.courier.com/client/q`. */
  apiUrl: string;
  /** Multi-tenant account id passed to `signIn`; empty string when unset. */
  tenantId: string;
  preferencePageDraftMode: boolean;
}

declare global {
  interface Window {
    courierConfig?: CourierConfig;
  }
}
