import { CourierThemeManager, CourierThemeSubscription, SystemThemeMode } from "@trycourier/courier-ui-core";
import { CourierPreferencesTheme, defaultDarkTheme, defaultLightTheme, mergeTheme } from "./courier-preferences-theme";

/** @public */
export interface CourierPreferencesThemeSubscription extends CourierThemeSubscription<CourierPreferencesTheme> {
  manager: CourierPreferencesThemeManager;
}

/**
 * Preferences-specific theme manager that extends the abstract CourierThemeManager.
 * @public
 */
export class CourierPreferencesThemeManager extends CourierThemeManager<CourierPreferencesTheme> {

  protected readonly THEME_CHANGE_EVENT: string = 'courier_preferences_theme_change';

  constructor(initialTheme: CourierPreferencesTheme) {
    super(initialTheme);
  }

  protected getDefaultLightTheme(): CourierPreferencesTheme {
    return defaultLightTheme;
  }

  protected getDefaultDarkTheme(): CourierPreferencesTheme {
    return defaultDarkTheme;
  }

  protected mergeTheme(mode: SystemThemeMode, theme: CourierPreferencesTheme): CourierPreferencesTheme {
    return mergeTheme(mode, theme);
  }

  public subscribe(callback: (theme: CourierPreferencesTheme) => void): CourierPreferencesThemeSubscription {
    const baseSubscription = super.subscribe(callback);
    return {
      ...baseSubscription,
      manager: this
    };
  }
}
