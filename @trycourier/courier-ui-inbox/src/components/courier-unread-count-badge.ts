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
        background-color: var(--courier-primary, #0066FF);
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

  private updateBadge() {
    if (this.count > 0) {
      this.badge.textContent = this.count.toString();
      this.badge.style.display = 'block';
    } else {
      this.badge.style.display = 'none';
    }
  }
}

// Register the custom element
if (!customElements.get('courier-unread-count-badge')) {
  customElements.define('courier-unread-count-badge', CourierUnreadCountBadge);
}
