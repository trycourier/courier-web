// Import courier-ui-core to ensure CourierIcon and other core elements are registered
// even when only type imports are used from this package
import '@trycourier/courier-ui-core';

export * from './components/courier-toast';
export * from './components/courier-toast-item';
export * from './types/courier-toast-theme';
export * from './types/courier-toast-theme-manager';
export * from './types/toast';
export * from './datastore/toast-datastore';
export * from './datastore/toast-datastore-listener';
export * from './datastore/toast-datastore-events';

import { Courier } from "@trycourier/courier-js";

Courier.shared.courierUserAgentName = "courier-ui-toast";
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
