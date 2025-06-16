import { CourierColors, CourierFactoryElement, CourierIconButton, CourierIconSVGs, registerElement } from "@trycourier/courier-ui-core";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";

export class CourierInboxMenuButton extends CourierFactoryElement {

  static get id(): string {
    return 'courier-inbox-menu-button';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // Components
  private _container?: HTMLDivElement;
  private _triggerButton?: CourierIconButton;
  private _unreadCountBadge?: CourierUnreadCountBadge;

  constructor(themeBus: CourierInboxThemeManager) {
    super();
    this._themeSubscription = themeBus.subscribe((_: CourierInboxTheme) => {
      this.updateTheme();
    });
  }

  defaultElement(): HTMLElement {

    // Create trigger button container
    this._container = document.createElement('div');
    this._container.className = 'menu-button-container';

    // Create trigger button
    this._triggerButton = new CourierIconButton(CourierIconSVGs.inbox);

    // Create unread count badge
    this._unreadCountBadge = new CourierUnreadCountBadge({
      themeBus: this._themeSubscription.manager,
      location: 'button'
    });
    this._unreadCountBadge.id = 'unread-badge';

    const style = document.createElement('style');
    style.textContent = this.getStyles();

    this._container.appendChild(style);
    this._container.appendChild(this._triggerButton);
    this._container.appendChild(this._unreadCountBadge);
    this.appendChild(this._container);

    // Set the theme of the button
    this.updateTheme();

    return this._container;
  }

  private getStyles(): string {
    return `
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
  }

  public onUnreadCountChange(unreadCount: number): void {
    this._unreadCountBadge?.setCount(unreadCount);
    this.updateTheme();
  }

  private updateTheme() {
    const theme = this._themeSubscription.manager.getTheme();

    // Trigger button
    this._triggerButton?.updateIconColor(theme?.popup?.button?.icon?.color ?? CourierColors.black[500]);
    this._triggerButton?.updateIconSVG(theme?.popup?.button?.icon?.svg ?? CourierIconSVGs.inbox);
    this._triggerButton?.updateBackgroundColor(theme?.popup?.button?.backgroundColor ?? 'transparent');
    this._triggerButton?.updateHoverBackgroundColor(theme?.popup?.button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._triggerButton?.updateActiveBackgroundColor(theme?.popup?.button?.activeBackgroundColor ?? CourierColors.black[500_20]);

    // Unread count badge
    this._unreadCountBadge?.refreshTheme('button');

  }

  disconnectedCallback() {
    this._themeSubscription.unsubscribe();
  }

}

registerElement(CourierInboxMenuButton);
