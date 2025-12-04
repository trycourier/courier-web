export * from './components/courier-inbox';
export * from './components/courier-inbox-header';
export * from './components/courier-inbox-list-item';
export * from './components/courier-inbox-popup-menu';
export * from './utils/extensions';
export * from './types/factories';
export * from './types/courier-inbox-theme';
export * from './types/courier-inbox-theme-manager';
export * from './types/inbox-data-set';
export * from './datastore/inbox-datastore';
export * from './datastore/datastore-listener';
export * from './datastore/datatore-events';

import { Courier } from "@trycourier/courier-js";

Courier.shared.courierUserAgentName = "courier-ui-inbox";
Courier.shared.courierUserAgentVersion = __PACKAGE_VERSION__;

// Re-export Courier from courier-js for direct import
export { Courier };

// Re-export types from courier-js
export type {
  CourierProps,
  CourierClientOptions,
  CourierBrand,
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

// Re-export types from courier-ui-core
export type {
  CourierComponentThemeMode
} from '@trycourier/courier-ui-core'
