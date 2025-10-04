import { CourierThemeManager, CourierThemeSubscription, SystemThemeMode } from "@trycourier/courier-ui-core";
import { CourierInboxTheme, defaultDarkTheme, defaultLightTheme, mergeTheme } from "./courier-inbox-theme";

export interface CourierInboxThemeSubscription extends CourierThemeSubscription<CourierInboxTheme> {
  manager: CourierInboxThemeManager;
}

/**
 * Inbox-specific theme manager that extends the abstract CourierThemeManager.
 * Provides inbox theme management with light/dark mode support.
 */
export class CourierInboxThemeManager extends CourierThemeManager<CourierInboxTheme> {

  // Event ID for inbox theme changes
  protected readonly THEME_CHANGE_EVENT: string = 'courier_inbox_theme_change';

  constructor(initialTheme: CourierInboxTheme) {
    super(initialTheme);
  }

  /**
   * Get the default light theme for inbox
   */
  protected getDefaultLightTheme(): CourierInboxTheme {
    return defaultLightTheme;
  }

  /**
   * Get the default dark theme for inbox
   */
  protected getDefaultDarkTheme(): CourierInboxTheme {
    return defaultDarkTheme;
  }

  /**
   * Merge the inbox theme with defaults
   */
  protected mergeTheme(mode: SystemThemeMode, theme: CourierInboxTheme): CourierInboxTheme {
    return mergeTheme(mode, theme);
  }

  /**
   * Subscribe to inbox theme changes
   * @param callback - Function to run when the theme changes
   * @returns Object with unsubscribe method to stop listening
   */
  public subscribe(callback: (theme: CourierInboxTheme) => void): CourierInboxThemeSubscription {
    const baseSubscription = super.subscribe(callback);
    return {
      ...baseSubscription,
      manager: this
    };
  }

}
