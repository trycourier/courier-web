import { CourierColors } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierUnreadCountBadge extends HTMLElement {
  private badge: HTMLElement;
  private count: number = 0;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create badge element
    this.badge = document.createElement('span');
    this.badge.className = 'unread-badge';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      .unread-badge {
        background-color: ${CourierColors.blue[500]};
        color: white;
        border-radius: 12px;
        padding: 4px 8px;
        font-size: 12px;
        text-align: center;
        display: none;
        pointer-events: none;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.badge);
  }

  public setCount(count: number) {
    this.count = count;
    this.updateBadge();
  }

  public setTheme(theme: CourierInboxTheme) {
    this.badge.style.backgroundColor = theme.header?.unreadIndicator?.backgroundColor ?? CourierColors.blue[500];
    this.badge.style.color = theme.header?.unreadIndicator?.color ?? CourierColors.white[500];
  }

  private updateBadge() {
    if (this.count > 0) {
      this.badge.textContent = this.count.toString();
      this.badge.style.display = 'block';
    } else {
      this.badge.style.display = 'none';
    }
  }
}

customElements.define('courier-unread-count-badge', CourierUnreadCountBadge);
