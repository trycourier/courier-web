import { CourierComponentThemeMode, SystemThemeMode, addSystemThemeModeListener, getSystemThemeMode } from "@trycourier/courier-ui-core";
import { CourierInboxTheme, defaultDarkTheme, defaultLightTheme, mergeTheme } from "./courier-inbox-theme";

export interface CourierInboxThemeSubscription {
  manager: CourierInboxThemeManager;
  remove: () => void;
}

export class CourierInboxThemeManager {

  // Event IDs
  private readonly THEME_CHANGE_EVENT: string = 'courier_inbox_theme_change';

  // State
  private _theme: CourierInboxTheme;
  private _lightTheme: CourierInboxTheme = defaultLightTheme;
  private _darkTheme: CourierInboxTheme = defaultDarkTheme;
  private _target: EventTarget;
  private _subscriptions: CourierInboxThemeSubscription[] = [];

  // System theme
  private _userMode: CourierComponentThemeMode;
  private _systemMode: SystemThemeMode;
  private _systemThemeCleanup: (() => void) | undefined;

  public setLightTheme(theme: CourierInboxTheme) {
    this._lightTheme = theme;
    if (this._systemMode === 'light') {
      this.updateTheme();
    }
  }

  public setDarkTheme(theme: CourierInboxTheme) {
    this._darkTheme = theme;
    if (this._systemMode === 'dark') {
      this.updateTheme();
    }
  }

  constructor(initialTheme: CourierInboxTheme) {
    this._theme = initialTheme;
    this._target = new EventTarget();
    this._userMode = 'system' as CourierComponentThemeMode;

    // Get the initial system theme
    this._systemMode = getSystemThemeMode();
    this.setLightTheme(defaultLightTheme);
    this.setDarkTheme(defaultDarkTheme);

    // Set up system theme listener
    this._systemThemeCleanup = addSystemThemeModeListener((mode: SystemThemeMode) => {
      this._systemMode = mode;
      this.updateTheme();
    });
  }

  /**
   * Get the current system theme
   */
  public get currentSystemTheme(): SystemThemeMode {
    return this._systemMode;
  }

  /**
   * Get the current theme
   */
  public getTheme() {
    return this._theme;
  }

  /**
   * Update the theme
   */
  private updateTheme() {

    // Use the user mode or fallback to the system mode
    const mode = this._userMode === 'system' ? this._systemMode : this._userMode;

    // Get the theme  
    const theme = mode === 'light' ? this._lightTheme : this._darkTheme;

    // Merge the theme
    const mergedTheme = mergeTheme(mode, theme);

    // Set the theme
    this.setTheme(mergedTheme);
  }

  /**
   * Set the theme and notify all listeners
   */
  private setTheme(theme: CourierInboxTheme) {
    if (theme === this._theme) return;
    this._theme = theme;
    this._target.dispatchEvent(new CustomEvent(this.THEME_CHANGE_EVENT, {
      detail: { theme }
    }));
  }

  /**
   * Set the mode and notify all listeners
   */
  public setMode(mode: CourierComponentThemeMode) {
    this._userMode = mode;
    this.updateTheme();
  }

  /**
   * Subscribe to theme changes
   * @param {Function} callback - Function to run when the theme changes
   * @returns {CourierInboxThemeSubscription} - Object with remove method to stop listening
   */
  subscribe(callback: (theme: CourierInboxTheme) => void): CourierInboxThemeSubscription {
    const controller = new AbortController();
    this._target.addEventListener(this.THEME_CHANGE_EVENT, ((e: Event) => {
      callback((e as CustomEvent<{ theme: CourierInboxTheme }>).detail.theme);
    }) as EventListener, { signal: controller.signal });

    const subscription: CourierInboxThemeSubscription = {
      manager: this,
      remove: () => {
        controller.abort();
        const index = this._subscriptions.indexOf(subscription);
        if (index > -1) {
          this._subscriptions.splice(index, 1);
        }
      }
    };

    this._subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Clean up event listeners
   */
  public cleanup() {
    if (this._systemThemeCleanup) {
      this._systemThemeCleanup();
    }
    this._subscriptions.forEach(subscription => subscription.remove());
    this._subscriptions = [];
  }

}