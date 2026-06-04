export * from './components/courier-preferences';
export * from './components/courier-preferences-section';
export * from './components/courier-preferences-topic';
export * from './components/courier-preference-toggle';
export * from './components/courier-digest-schedule';
export * from './components/courier-channel-routing';
export * from './types/preferences';
export * from './types/courier-preferences-theme';
export * from './types/courier-preferences-theme-manager';
export * from './utils/format-digest';

import { Courier } from "@trycourier/courier-js";

Courier.shared.courierUserAgentName = "courier-ui-preferences";
Courier.shared.courierUserAgentVersion = __PACKAGE_VERSION__;

export { Courier };

export type {
  CourierProps,
  CourierClientOptions,
  CourierBrand,
  CourierApiRegion,
  CourierApiUrls,
  CourierUserPreferences,
  CourierUserPreferencesStatus,
  CourierUserPreferencesChannel,
  CourierUserPreferencesPaging,
  CourierUserPreferencesTopic,
  CourierUserPreferencesTopicResponse,
  CourierDigestScheduleOption,
  CourierDevice,
  CourierToken,
} from '@trycourier/courier-js';

export {
  DEFAULT_COURIER_API_URLS,
  EU_COURIER_API_URLS,
  getCourierApiUrls,
  getCourierApiUrlsForRegion
} from '@trycourier/courier-js';

export type {
  CourierComponentThemeMode
} from '@trycourier/courier-ui-core'
