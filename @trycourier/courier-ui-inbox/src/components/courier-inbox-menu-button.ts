import { CourierColors, CourierElement, CourierIconButton, CourierIconSource, theme } from "@trycourier/courier-ui-core";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierInboxMenuButton extends CourierElement {

  // State
  private _theme?: CourierInboxTheme;

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
    this.updateTheme();
  }

  public setTheme(theme: CourierInboxTheme) {
    this._theme = theme;
    this.updateTheme();
  }

  private updateTheme() {

    // Button
    this._triggerButton?.updateIconColor(this._theme?.popup?.button?.icon?.color ?? CourierColors.black[500]);
    this._triggerButton?.updateIconSVG(this._theme?.popup?.button?.icon?.svg ?? CourierIconSource.inbox);
    this._triggerButton?.updateBackgroundColor(this._theme?.popup?.button?.backgroundColor ?? 'transparent');
    this._triggerButton?.updateHoverBackgroundColor(this._theme?.popup?.button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._triggerButton?.updateActiveBackgroundColor(this._theme?.popup?.button?.activeBackgroundColor ?? CourierColors.black[500_20]);

    // Unread count badge
    this._unreadCountBadge?.setUnreadIndicatorStyles(this._theme?.popup?.button?.unreadIndicator);
  }

}

if (!customElements.get('courier-inbox-menu-button')) {
  customElements.define('courier-inbox-menu-button', CourierInboxMenuButton);
}
