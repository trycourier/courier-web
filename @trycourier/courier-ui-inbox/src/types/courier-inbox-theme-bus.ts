import { CourierInboxTheme } from "./courier-inbox-theme";

export class CourierInboxThemeBus {

  // Event ID
  private readonly EVENT_ID: string = 'courier_inbox_theme_change';

  // State
  private _theme: CourierInboxTheme;
  private _target: EventTarget;

  constructor(initialTheme: CourierInboxTheme) {
    this._theme = initialTheme;
    this._target = new EventTarget();
  }

  /**
   * Get the current theme
   */
  getTheme() {
    return this._theme;
  }

  /**
   * Set the theme and notify all listeners
   */
  setTheme(theme: CourierInboxTheme) {
    if (theme === this._theme) return;
    this._theme = theme;
    this._target.dispatchEvent(new CustomEvent(this.EVENT_ID, {
      detail: { theme }
    }));
  }

  /**
   * Subscribe to theme changes
   * @param {Function} callback - Function to run when the theme changes
   * @returns {AbortController} - Use this to stop listening later
   */
  subscribe(callback: (theme: CourierInboxTheme) => void): AbortController {
    const controller = new AbortController();
    this._target.addEventListener(this.EVENT_ID, ((e: Event) => {
      callback((e as CustomEvent<{ theme: CourierInboxTheme }>).detail.theme);
    }) as EventListener, { signal: controller.signal });

    return controller;
  }

  /**
   * Remove all listeners (optional utility)
   */
  destroy() {
    // This is just a convenience method if needed
    // Consumers should abort manually using the controller from `onChange`
  }
}