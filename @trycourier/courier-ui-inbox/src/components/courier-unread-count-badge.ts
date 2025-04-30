import { CourierColors } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierUnreadCountBadge extends HTMLElement {

  // State
  private _count: number = 0;

  // Elements
  private _badge: HTMLElement;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create badge element
    this._badge = document.createElement('span');
    this._badge.className = 'unread-badge';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      .unread-badge {
        background-color: var(--background-color, ${CourierColors.blue[500]});
        color: var(--color, white);
        border-radius: var(--border-radius, 12px);
        padding: 4px 8px;
        font-size: var(--font-size, 14px);
        text-align: center;
        display: none;
        pointer-events: none;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this._badge);
  }

  public setCount(count: number) {
    this._count = count
    this.updateBadge();
  }

  public setTheme(theme: CourierInboxTheme) {
    this.style.setProperty('--background-color', theme.header?.filters?.unreadIndicator?.backgroundColor ?? CourierColors.blue[500]);
    this.style.setProperty('--color', theme.header?.filters?.unreadIndicator?.font?.color ?? CourierColors.white[500]);
    this.style.setProperty('--font-size', theme.header?.filters?.unreadIndicator?.font?.size ?? '14px');
    this.style.setProperty('--border-radius', theme.header?.filters?.unreadIndicator?.borderRadius ?? '12px');
  }

  private updateBadge() {
    if (this._count > 0) {
      this._badge.textContent = this._count.toString();
      this._badge.style.display = 'block';
    } else {
      this._badge.style.display = 'none';
    }
  }
}

customElements.define('courier-unread-count-badge', CourierUnreadCountBadge);
