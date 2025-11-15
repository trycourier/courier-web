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
  private _isActive: boolean = false;

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

    // Inject styles
    this._style = document.createElement('style');
    this._style.textContent = CourierUnreadCountBadge.getStyles(this.theme);
    document.head.appendChild(this._style);

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
        padding: 3px 8px;
        font-size: 12px;
        text-align: center;
        display: none;
        pointer-events: none;
      }

      ${CourierUnreadCountBadge.id} .header.active {
        background-color: ${theme.inbox?.header?.filters?.unreadIndicator?.backgroundColor};
        color: ${theme.inbox?.header?.filters?.unreadIndicator?.font?.color};
        border-radius: ${theme.inbox?.header?.filters?.unreadIndicator?.borderRadius};
        font-size: ${theme.inbox?.header?.filters?.unreadIndicator?.font?.size};
        padding: ${theme.inbox?.header?.filters?.unreadIndicator?.padding};
      }

      ${CourierUnreadCountBadge.id} .header.inactive {
        background-color: ${theme.inbox?.header?.filters?.inactiveUnreadIndicator?.backgroundColor};
        color: ${theme.inbox?.header?.filters?.inactiveUnreadIndicator?.font?.color};
        border-radius: ${theme.inbox?.header?.filters?.inactiveUnreadIndicator?.borderRadius};
        font-size: ${theme.inbox?.header?.filters?.inactiveUnreadIndicator?.font?.size};
        padding: ${theme.inbox?.header?.filters?.inactiveUnreadIndicator?.padding};
      }
    `
  }

  public setCount(count: number) {
    this._count = count;
    this.updateBadge();
  }

  public setActive(active: boolean) {
    this._isActive = active;
    this.updateBadge();
  }

  public refreshTheme(location: CourierUnreadCountLocation) {
    this._location = location;
    this.updateBadge();
  }

  private updateBadge() {
    if (this._badge) {
      // Update class based on active state
      this._badge.className = `unread-badge ${this._location}`;
      if (this._location === 'header') {
        this._badge.classList.add(this._isActive ? 'active' : 'inactive');
      }

      if (this._count > 0) {
        this._badge.textContent = this._count > 99 ? '99+' : this._count.toString();
        this.style.display = 'inline-block';
        this._badge.style.display = 'block';
      } else {
        // display style must be applied to the top level component
        // so the flex model doesn't show a gap between the previous element and this one
        // when display is none
        this.style.display = 'none';
      }
    }
  }
}

registerElement(CourierUnreadCountBadge);
