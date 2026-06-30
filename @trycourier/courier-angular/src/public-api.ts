import { Courier } from "@trycourier/courier-js";
import { COURIER_ANGULAR_VERSION } from "./version";

Courier.shared.courierUserAgentName = "courier-angular";
Courier.shared.courierUserAgentVersion = COURIER_ANGULAR_VERSION;

export { CourierInboxComponent } from "./components/courier-inbox.component";
export { CourierInboxPopupMenuComponent } from "./components/courier-inbox-popup-menu.component";
export { CourierToastComponent } from "./components/courier-toast.component";
export { CourierPreferencesComponent } from "./components/courier-preferences.component";

export { CourierService } from "./services/courier.service";
export type { CourierAuthState, CourierInboxState, CourierToastState } from "./services/courier.service";

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
  CourierDigestScheduleOption,
  CourierDevice,
  CourierToken,
  CourierGetInboxMessageResponse,
  CourierGetInboxMessagesResponse,
  InboxMessage,
  InboxAction,
  InboxMessageEventEnvelope,
} from "@trycourier/courier-js";

export {
  DEFAULT_COURIER_API_URLS,
  EU_COURIER_API_URLS,
  getCourierApiUrls,
  getCourierApiUrlsForRegion,
} from "@trycourier/courier-js";

// Re-export utility functions from courier-ui-inbox
export { markAsRead, markAsUnread, clickMessage, archiveMessage, openMessage } from "@trycourier/courier-ui-inbox";

// Re-export default configuration functions from courier-ui-inbox
export { defaultFeeds, defaultActions, defaultListItemActions } from "@trycourier/courier-ui-inbox";

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
  CourierInboxDatasetFilter,
} from "@trycourier/courier-ui-inbox";

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
  CourierActionMenuTheme,
} from "@trycourier/courier-ui-inbox";

// Re-export theme utilities from courier-ui-inbox
export { defaultLightTheme, defaultDarkTheme, mergeTheme } from "@trycourier/courier-ui-inbox";

// Re-export element types from courier-ui-inbox
export type { CourierInbox as CourierInboxElement } from "@trycourier/courier-ui-inbox";
export type { CourierInboxPopupMenu as CourierInboxPopupMenuElement } from "@trycourier/courier-ui-inbox";

// Re-export element types from courier-ui-toast
export type { CourierToast as CourierToastElement } from "@trycourier/courier-ui-toast";

// Re-export toast types from courier-ui-toast
export type {
  CourierToastTheme,
  CourierToastFontTheme,
  CourierToastIconTheme,
  CourierToastItemTheme,
  CourierToastItemFactoryProps,
  CourierToastItemClickEvent,
  CourierToastDismissButtonOption,
} from "@trycourier/courier-ui-toast";

// Re-export toast theme utilities from courier-ui-toast
export {
  defaultLightTheme as defaultToastLightTheme,
  defaultDarkTheme as defaultToastDarkTheme,
  mergeTheme as mergeToastTheme,
} from "@trycourier/courier-ui-toast";

// Re-export element types from courier-ui-preferences
export type { CourierPreferences as CourierPreferencesElement } from "@trycourier/courier-ui-preferences";

// Re-export preferences types from courier-ui-preferences
export type {
  CourierPreferencesTheme,
  CourierPreferencesFontTheme,
  CourierPreferencesToggleTheme,
  CourierPreferencesSectionTheme,
  CourierPreferencesTopicTheme,
  CourierPreferencesDigestTheme,
  CourierPreferencesChannelChipTheme,
} from "@trycourier/courier-ui-preferences";

// Re-export preferences theme utilities from courier-ui-preferences
export {
  defaultLightTheme as defaultPreferencesLightTheme,
  defaultDarkTheme as defaultPreferencesDarkTheme,
  mergeTheme as mergePreferencesTheme,
} from "@trycourier/courier-ui-preferences";

// Re-export types from courier-ui-core
export type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
