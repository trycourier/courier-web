import { CourierElement, CourierIconButton, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxMenuButton extends CourierElement {

  // Components
  private _container?: HTMLDivElement;
  private _triggerButton?: CourierIconButton;
  private _unreadCountBadge?: CourierUnreadCountBadge;

  defaultElement(): HTMLElement {

    // Create trigger button container
    this._container = document.createElement('div');
    this._container.className = 'menu-button-container';

    // Create trigger button
    this._triggerButton = new CourierIconButton(CourierIconSource.inbox);

    // Create unread count badge
    this._unreadCountBadge = new CourierUnreadCountBadge();
    this._unreadCountBadge.id = 'unread-badge';

    const style = document.createElement('style');
    style.textContent = `
      .menu-button-container {
        position: relative;
        display: inline-block;
      }
        
      #unread-badge {
        position: absolute;
        top: -8px;
        left: 50%;
        pointer-events: none;
      }
    `;

    this._container.appendChild(style);
    this._container.appendChild(this._triggerButton);
    this._container.appendChild(this._unreadCountBadge);
    this.shadow.appendChild(this._container);
    return this._container;
  }

  public onUnreadCountChange(unreadCount: number): void {
    this._unreadCountBadge?.setCount(unreadCount);
  }

}

if (!customElements.get('courier-inbox-menu-button')) {
  customElements.define('courier-inbox-menu-button', CourierInboxMenuButton);
}
