import { Courier } from '@trycourier/courier-js';

Courier.shared.courierUserAgentName = "courier-react";
Courier.shared.courierUserAgentVersion = __PACKAGE_VERSION__;

export { CourierInbox } from './components/courier-inbox';
export { CourierInboxPopupMenu } from './components/courier-inbox-popup-menu';
export { CourierToast } from './components/courier-toast';

export { useCourier } from '@trycourier/courier-react-components';

export type {
  CourierInboxProps,
  CourierInboxPopupMenuProps,
  CourierToastProps,
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

// Re-export default configuration functions from courier-ui-inbox
export {
  defaultFeeds,
  defaultActions,
  defaultListItemActions
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
  CourierInboxFeed,
  CourierInboxTab,
  CourierInboxDatasetFilter
} from '@trycourier/courier-ui-inbox';

// Re-export theme types from courier-ui-inbox
export type {
  CourierInboxTheme,
  CourierInboxFontTheme,
  CourierInboxIconTheme,
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

// Re-export element types from courier-ui-toast
export type { CourierToast as CourierToastElement } from '@trycourier/courier-ui-toast';

// Re-export toast types from courier-ui-toast
export type {
  CourierToastTheme,
  CourierToastFontTheme,
  CourierToastIconTheme,
  CourierToastItemTheme,
  CourierToastItemFactoryProps,
  CourierToastItemClickEvent,
  CourierToastDismissButtonOption
} from '@trycourier/courier-ui-toast';

// Re-export toast theme utilities from courier-ui-toast
export {
  defaultLightTheme as defaultToastLightTheme,
  defaultDarkTheme as defaultToastDarkTheme,
  mergeTheme as mergeToastTheme
} from '@trycourier/courier-ui-toast';

// Re-export types from courier-ui-core
export type {
  CourierComponentThemeMode
} from '@trycourier/courier-ui-core'
