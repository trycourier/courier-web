import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-bus";

export type CourierUnreadCountLocation = 'button' | 'header';

export class CourierUnreadCountBadge extends HTMLElement {

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _location: CourierUnreadCountLocation;
  private _count: number = 0;

  // Elements
  private _badge: HTMLElement;
  private _style: HTMLStyleElement;

  constructor(props: { themeBus: CourierInboxThemeManager, location: CourierUnreadCountLocation }) {
    super();

    this._location = props.location;

    // Initialize the theme subscription
    this._themeSubscription = props.themeBus.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme(this._location);
    });

    const shadow = this.attachShadow({ mode: 'open' });

    // Create badge element
    this._badge = document.createElement('span');
    this._badge.className = 'unread-badge';

    // Add styles
    this._style = document.createElement('style');
    this._style.textContent = this.getStyles(this._location);

    shadow.appendChild(this._style);
    shadow.appendChild(this._badge);
  }

  private getStyles(location: CourierUnreadCountLocation): string {

    const theme = this._themeSubscription.manager.getTheme();

    // Get the indicator styles
    const indicator = location === 'button'
      ? theme.popup?.button?.unreadIndicator
      : theme.inbox?.header?.filters?.unreadIndicator;

    const backgroundColor = indicator?.backgroundColor;
    const borderRadius = indicator?.borderRadius;
    const color = indicator?.font?.color;
    const fontSize = indicator?.font?.size;

    // Return the styles
    return `
      :host {
        display: inline-block;
      }

      .unread-badge {
        background-color: ${backgroundColor};
        color: ${color};
        border-radius: ${borderRadius};
        padding: 4px 8px;
        font-size: ${fontSize};
        text-align: center;
        display: none;
        pointer-events: none;
      }
    `
  }

  public setCount(count: number) {
    this._count = count
    this.updateBadge();
  }

  public refreshTheme(location: CourierUnreadCountLocation) {
    this._location = location;
    this.updateBadge();
  }

  private updateBadge() {
    this._style.textContent = this.getStyles(this._location);
    if (this._count > 0) {
      this._badge.textContent = this._count.toString();
      this._badge.style.display = 'block';
    } else {
      this._badge.style.display = 'none';
    }
  }

  disconnectedCallback() {
    this._themeSubscription.unsubscribe();
  }

}

customElements.define('courier-unread-count-badge', CourierUnreadCountBadge);
