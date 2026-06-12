import { CourierThemeManager, CourierThemeSubscription, SystemThemeMode } from "@trycourier/courier-ui-core";
import { CourierBannerTheme, defaultDarkTheme, defaultLightTheme, mergeTheme } from "./courier-banner-theme";

/**
 * @public
 */
export interface CourierBannerThemeSubscription extends CourierThemeSubscription<CourierBannerTheme> {
  manager: CourierBannerThemeManager;
}

/**
 * Banner-specific theme manager that extends the abstract CourierThemeManager.
 * Provides banner theme management with light/dark mode support.
 *
 * @public
 */
export class CourierBannerThemeManager extends CourierThemeManager<CourierBannerTheme> {

  // Event ID for banner theme changes
  protected readonly THEME_CHANGE_EVENT: string = 'courier_banner_theme_change';

  constructor(initialTheme: CourierBannerTheme) {
    super(initialTheme);
  }

  /**
   * Get the default light theme for banner
   */
  protected getDefaultLightTheme(): CourierBannerTheme {
    return defaultLightTheme;
  }

  /**
   * Get the default dark theme for banner
   */
  protected getDefaultDarkTheme(): CourierBannerTheme {
    return defaultDarkTheme;
  }

  /**
   * Merge the banner theme with defaults
   */
  protected mergeTheme(mode: SystemThemeMode, theme: CourierBannerTheme): CourierBannerTheme {
    return mergeTheme(mode, theme);
  }

  /**
   * Subscribe to banner theme changes
   * @param callback - Function to run when the theme changes
   * @returns Object with unsubscribe method to stop listening
   */
  public subscribe(callback: (theme: CourierBannerTheme) => void): CourierBannerThemeSubscription {
    const baseSubscription = super.subscribe(callback);
    return {
      ...baseSubscription,
      manager: this
    };
  }

}
