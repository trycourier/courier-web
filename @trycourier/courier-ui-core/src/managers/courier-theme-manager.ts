import { CourierComponentThemeMode, SystemThemeMode, addSystemThemeModeListener, getSystemThemeMode } from "../utils/system-theme-mode";

export interface CourierThemeSubscription<TTheme> {
  manager: CourierThemeManager<TTheme>;
  unsubscribe: () => void;
}

/**
 * Abstract base class for theme management in Courier UI packages.
 *
 * This class provides:
 * - Light/dark theme switching
 * - System theme detection and auto-switching
 * - Theme subscription/notification system
 * - User mode override (light, dark, or system)
 *
 * Subclasses must implement:
 * - getDefaultLightTheme(): return the default light theme
 * - getDefaultDarkTheme(): return the default dark theme
 * - mergeTheme(): merge user theme with defaults
 */
export abstract class CourierThemeManager<TTheme> {

  // Abstract properties and methods that subclasses must implement
  protected abstract readonly THEME_CHANGE_EVENT: string;
  protected abstract getDefaultLightTheme(): TTheme;
  protected abstract getDefaultDarkTheme(): TTheme;
  protected abstract mergeTheme(mode: SystemThemeMode, theme: TTheme): TTheme;

  // State (protected so subclasses can access if needed)
  protected _theme: TTheme;
  protected _lightTheme!: TTheme;
  protected _darkTheme!: TTheme;
  protected _target: EventTarget;
  protected _subscriptions: CourierThemeSubscription<TTheme>[] = [];

  // System theme
  protected _userMode: CourierComponentThemeMode;
  protected _systemMode: SystemThemeMode;
  protected _systemThemeCleanup: (() => void) | undefined;

  constructor(initialTheme: TTheme) {
    this._theme = initialTheme;
    this._target = new EventTarget();
    this._userMode = 'system' as CourierComponentThemeMode;

    // Get the initial system theme
    this._systemMode = getSystemThemeMode();
    this.setLightTheme(this.getDefaultLightTheme());
    this.setDarkTheme(this.getDefaultDarkTheme());

    // Set up system theme listener
    this._systemThemeCleanup = addSystemThemeModeListener((mode: SystemThemeMode) => {
      this._systemMode = mode;
      this.updateTheme();
    });
  }

  /**
   * Set the light theme
   */
  public setLightTheme(theme: TTheme) {
    this._lightTheme = theme;
    if (this._systemMode === 'light') {
      this.updateTheme();
    }
  }

  /**
   * Set the dark theme
   */
  public setDarkTheme(theme: TTheme) {
    this._darkTheme = theme;
    if (this._systemMode === 'dark') {
      this.updateTheme();
    }
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
  public getTheme(): TTheme {
    return this._theme;
  }

  /**
   * Update the theme based on current mode
   */
  protected updateTheme() {
    // Use the user mode or fallback to the system mode
    const mode = this._userMode === 'system' ? this._systemMode : this._userMode;

    // Get the theme
    const theme = mode === 'light' ? this._lightTheme : this._darkTheme;

    // Merge the theme
    const mergedTheme = this.mergeTheme(mode, theme);

    // Set the theme
    this.setTheme(mergedTheme);
  }

  /**
   * Set the theme and notify all listeners
   */
  private setTheme(theme: TTheme) {
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
   * Get the current mode
   */
  public get mode(): CourierComponentThemeMode {
    return this._userMode;
  }

  /**
   * Subscribe to theme changes
   * @param callback - Function to run when the theme changes
   * @returns - Object with unsubscribe method to stop listening
   */
  public subscribe(callback: (theme: TTheme) => void): CourierThemeSubscription<TTheme> {
    const controller = new AbortController();
    this._target.addEventListener(this.THEME_CHANGE_EVENT, ((e: Event) => {
      callback((e as CustomEvent<{ theme: TTheme }>).detail.theme);
    }) as EventListener, { signal: controller.signal });

    const subscription: CourierThemeSubscription<TTheme> = {
      manager: this,
      unsubscribe: () => {
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
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._subscriptions = [];
  }

}
