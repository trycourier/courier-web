import { CourierThemeManager, CourierThemeSubscription, SystemThemeMode } from "@trycourier/courier-ui-core";
import { CourierToastTheme, defaultDarkTheme, defaultLightTheme, mergeTheme } from "./courier-toast-theme";

/**
 * @public
 */
export interface CourierToastThemeSubscription extends CourierThemeSubscription<CourierToastTheme> {
  manager: CourierToastThemeManager;
}

/**
 * Toast-specific theme manager that extends the abstract CourierThemeManager.
 * Provides toast theme management with light/dark mode support.
 *
 * @public
 */
export class CourierToastThemeManager extends CourierThemeManager<CourierToastTheme> {

  // Event ID for toast theme changes
  protected readonly THEME_CHANGE_EVENT: string = 'courier_toast_theme_change';

  constructor(initialTheme: CourierToastTheme) {
    super(initialTheme);
  }

  /**
   * Get the default light theme for toast
   */
  protected getDefaultLightTheme(): CourierToastTheme {
    return defaultLightTheme;
  }

  /**
   * Get the default dark theme for toast
   */
  protected getDefaultDarkTheme(): CourierToastTheme {
    return defaultDarkTheme;
  }

  /**
   * Merge the toast theme with defaults
   */
  protected mergeTheme(mode: SystemThemeMode, theme: CourierToastTheme): CourierToastTheme {
    return mergeTheme(mode, theme);
  }

  /**
   * Subscribe to toast theme changes
   * @param callback - Function to run when the theme changes
   * @returns Object with unsubscribe method to stop listening
   */
  public subscribe(callback: (theme: CourierToastTheme) => void): CourierToastThemeSubscription {
    const baseSubscription = super.subscribe(callback);
    return {
      ...baseSubscription,
      manager: this
    };
  }

}
