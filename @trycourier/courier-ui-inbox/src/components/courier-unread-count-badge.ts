import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";

export type CourierUnreadCountLocation = 'button' | 'header';

export class CourierUnreadCountBadge extends CourierBaseElement {

  static get id(): string {
    return 'courier-unread-count-badge';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _location: CourierUnreadCountLocation;
  private _count: number = 0;

  // Elements
  private _badge?: HTMLElement;
  private _style?: HTMLStyleElement;

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: { themeBus: CourierInboxThemeManager, location: CourierUnreadCountLocation }) {
    super();
    this._location = props.location;
    this._themeSubscription = props.themeBus.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme(this._location);
    });
  }

  onComponentMounted() {

    // Create badge element
    this._badge = document.createElement('span');
    this._badge.className = `unread-badge ${this._location}`;

    this.appendChild(this._badge);
    this.updateBadge();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  static getStyles(theme: CourierInboxTheme): string {
    return `
      ${CourierUnreadCountBadge.id} {
        display: inline-block;
      }

      ${CourierUnreadCountBadge.id} .unread-badge {
        padding: 4px 8px;
        text-align: center;
        display: none;
        pointer-events: none;
      }

      ${CourierUnreadCountBadge.id} .button {
        background-color: ${theme.popup?.button?.unreadIndicator?.backgroundColor};
        color: ${theme.popup?.button?.unreadIndicator?.font?.color};
        border-radius: ${theme.popup?.button?.unreadIndicator?.borderRadius};
        font-size: ${theme.popup?.button?.unreadIndicator?.font?.size};
      }

      ${CourierUnreadCountBadge.id} .header {
        background-color: ${theme.inbox?.header?.filters?.unreadIndicator?.backgroundColor};
        color: ${theme.inbox?.header?.filters?.unreadIndicator?.font?.color};
        border-radius: ${theme.inbox?.header?.filters?.unreadIndicator?.borderRadius};
        font-size: ${theme.inbox?.header?.filters?.unreadIndicator?.font?.size};
      }
    `
  }

  public setCount(count: number) {
    this._count = count;
    this.updateBadge();
  }

  public refreshTheme(location: CourierUnreadCountLocation) {
    this._location = location;
    this.updateBadge();
  }
  private updateBadge() {
    if (this._badge) {
      if (this._count > 0) {
        this._badge.textContent = this._count.toString();
        this._badge.style.display = 'block';
      } else {
        this._badge.style.display = 'none';
      }
    }
  }
}

registerElement(CourierUnreadCountBadge);
