import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme, CourierInboxUnreadCountIndicatorTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";

export type CourierUnreadCountBadgeLocation = "feed" | "tab";

export class CourierUnreadCountBadge extends CourierBaseElement {

  static get id(): string {
    return 'courier-unread-count-badge';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;
  private _location: CourierUnreadCountBadgeLocation;

  // State
  private _count: number = 0;

  // Elements
  private _style?: HTMLStyleElement;
  private _shadowRoot?: ShadowRoot;
  private _container?: HTMLElement;

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: { themeBus: CourierInboxThemeManager, location: CourierUnreadCountBadgeLocation }) {
    super();
    this._location = props.location;

    this._themeSubscription = props.themeBus.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme();
    });
  }

  onComponentMounted() {
    this.attachElements();
    this.setActive(true);
    this.updateBadge();
  }

  private attachElements() {
    // Attach shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'closed' });

    // Create container element
    this._container = document.createElement('div');
    this._container.className = 'badge-container';

    // Create and add style
    this._style = document.createElement('style');
    this._style.textContent = this.getStyles();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.appendChild(this._container);
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
  }

  private static getThemePath(
    theme: CourierInboxTheme,
    location: CourierUnreadCountBadgeLocation,
    active: boolean
  ): CourierInboxUnreadCountIndicatorTheme | undefined {
    if (location === "tab") {
      const tabsTheme = theme.inbox?.header?.tabs;
      return active
        ? tabsTheme?.selected?.unreadIndicator
        : tabsTheme?.default?.unreadIndicator;
    } else {
      // Default to "feed" location
      return theme.inbox?.header?.feedButton?.unreadIndicator;
    }
  }

  static getStyles(theme: CourierInboxTheme, location: CourierUnreadCountBadgeLocation = "feed"): string {
    const activeTheme = CourierUnreadCountBadge.getThemePath(theme, location, true);
    const inactiveTheme = CourierUnreadCountBadge.getThemePath(theme, location, false);

    // Fallback to feed button theme if location-specific theme is not available
    const fallbackTheme = theme.inbox?.header?.feedButton?.unreadIndicator;

    return `
      :host {
        display: inline-block;
      }

      .badge-container {
        display: none;
        pointer-events: none;
      }

      :host(.active) .badge-container {
        display: inline-block;
        background-color: ${activeTheme?.backgroundColor ?? fallbackTheme?.backgroundColor};
        color: ${activeTheme?.font?.color ?? fallbackTheme?.font?.color};
        border-radius: ${activeTheme?.borderRadius ?? fallbackTheme?.borderRadius};
        font-size: ${activeTheme?.font?.size ?? fallbackTheme?.font?.size};
        padding: ${activeTheme?.padding ?? fallbackTheme?.padding};
      }

      :host(.inactive) .badge-container {
        display: inline-block;
        background-color: ${inactiveTheme?.backgroundColor ?? fallbackTheme?.backgroundColor};
        color: ${inactiveTheme?.font?.color ?? fallbackTheme?.font?.color};
        border-radius: ${inactiveTheme?.borderRadius ?? fallbackTheme?.borderRadius};
        font-size: ${inactiveTheme?.font?.size ?? fallbackTheme?.font?.size};
        padding: ${inactiveTheme?.padding ?? fallbackTheme?.padding};
      }
    `
  }

  private getStyles(): string {
    return CourierUnreadCountBadge.getStyles(this.theme, this._location);
  }

  public setCount(count: number) {
    this._count = count;
    this.updateBadge();
  }

  public setActive(active: boolean) {
    this.className = active ? 'active' : 'inactive';
    if (this._style) {
      this._style.textContent = this.getStyles();
    }
    this.updateBadge();
  }

  public refreshTheme() {
    if (this._style) {
      this._style.textContent = this.getStyles();
    }
    this.updateBadge();
  }

  private updateBadge() {
    if (!this._container) return;

    // Set display on the host element (this element)
    if (this._count > 0) {
      this.style.display = 'inline-block';
      this._container.textContent = this._count > 99 ? '99+' : this._count.toString();
    } else {
      this.style.display = 'none';
      this._container.textContent = '';
    }
  }
}

registerElement(CourierUnreadCountBadge);
