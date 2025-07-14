// Import core Courier dependencies
import '@trycourier/courier-js';
import '@trycourier/courier-ui-inbox';

// Export local hooks and components
export * from './hooks/use-courier';
export * from './components/courier-inbox';
export * from './components/courier-inbox-popup-menu';

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
  CourierInboxUnreadIndicatorTheme,
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

// Re-export types from courier-ui-core
export type {
  CourierComponentThemeMode
} from '@trycourier/courier-ui-core'
