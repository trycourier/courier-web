export * from './components/courier-banner';
export * from './components/courier-banner-item';
export * from './types/courier-banner-theme';
export * from './types/courier-banner-theme-manager';
export * from './types/banner';
export * from './datastore/banner-datastore';
export * from './datastore/banner-datastore-listener';
export * from './datastore/banner-datastore-events';

import { Courier } from "@trycourier/courier-js";

Courier.shared.courierUserAgentName = "courier-ui-banner";
Courier.shared.courierUserAgentVersion = __PACKAGE_VERSION__;

// Re-export Courier from courier-js for direct import
export { Courier };

// Re-export types from courier-js
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
  CourierDevice,
  CourierToken,
  CourierGetInboxMessageResponse,
  CourierGetInboxMessagesResponse,
  InboxMessage,
  InboxAction,
  InboxMessageEventEnvelope,
} from '@trycourier/courier-js';

export {
  DEFAULT_COURIER_API_URLS,
  EU_COURIER_API_URLS,
  getCourierApiUrls,
  getCourierApiUrlsForRegion
} from '@trycourier/courier-js';

// Re-export types from courier-ui-core
export type {
  CourierComponentThemeMode
} from '@trycourier/courier-ui-core'
