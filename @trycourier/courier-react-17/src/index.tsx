import { Courier } from '@trycourier/courier-js';

Courier.shared.telemetry.callerSdkName = "courier-react";
Courier.shared.telemetry.callerSdkVersion = __PACKAGE_VERSION__;

export { CourierInbox } from './components/courier-inbox';
export { CourierInboxPopupMenu } from './components/courier-inbox-popup-menu';

export { useCourier } from '@trycourier/courier-react-components';

export type {
  CourierInboxProps,
  CourierInboxPopupMenuProps,
} from '@trycourier/courier-react-components';

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

// Re-export utility functions from courier-ui-inbox
export {
  markAsRead,
  markAsUnread,
  clickMessage,
  archiveMessage,
  openMessage
} from '@trycourier/courier-ui-inbox';

// Re-export factory prop types from courier-ui-inbox
export type {
  CourierInboxHeaderFactoryProps,
  CourierInboxStateLoadingFactoryProps,
  CourierInboxStateEmptyFactoryProps,
  CourierInboxStateErrorFactoryProps,
  CourierInboxListItemFactoryProps,
  CourierInboxListItemActionFactoryProps,
  CourierInboxPaginationItemFactoryProps,
  CourierInboxMenuButtonFactoryProps,
  CourierInboxFeedType
} from '@trycourier/courier-ui-inbox';

// Re-export theme types from courier-ui-inbox
export type {
  CourierInboxTheme,
  CourierInboxFontTheme,
  CourierInboxIconTheme,
  CourierInboxFilterItemTheme,
  CourierInboxUnreadCountIndicatorTheme,
  CourierInboxUnreadDotIndicatorTheme,
  CourierInboxIconButtonTheme,
  CourierInboxButtonTheme,
  CourierInboxMenuButtonTheme,
  CourierInboxPopupTheme,
  CourierInboxListItemTheme,
  CourierInboxSkeletonLoadingStateTheme,
  CourierInboxInfoStateTheme,
  CourierMenuItemTheme,
  CourierFilterMenuTheme,
  CourierActionMenuTheme
} from '@trycourier/courier-ui-inbox';

// Re-export theme utilities from courier-ui-inbox
export {
  defaultLightTheme,
  defaultDarkTheme,
  mergeTheme
} from '@trycourier/courier-ui-inbox';

// Re-export element types from courier-ui-inbox
export type { CourierInbox as CourierInboxElement } from '@trycourier/courier-ui-inbox';
export type { CourierInboxPopupMenu as CourierInboxPopupMenuElement } from '@trycourier/courier-ui-inbox';

// Re-export types from courier-ui-core
export type {
  CourierComponentThemeMode
} from '@trycourier/courier-ui-core'
