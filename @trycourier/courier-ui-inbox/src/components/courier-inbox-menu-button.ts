import { CourierColors, CourierFactoryElement, CourierIconButton, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
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
  private _style?: HTMLStyleElement;
  private _container?: HTMLDivElement;
  private _triggerButton?: CourierIconButton;
  private _unreadCountBadge?: CourierUnreadCountBadge;

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(themeBus: CourierInboxThemeManager) {
    super();
    this._themeSubscription = themeBus.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme();
    });
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxMenuButton.id, CourierInboxMenuButton.getStyles(this.theme));
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
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

    this._container.appendChild(this._triggerButton);
    this._container.appendChild(this._unreadCountBadge);
    this.appendChild(this._container);

    // Set the theme of the button
    this.refreshTheme();

    return this._container;
  }

  static getStyles(_theme: CourierInboxTheme): string {
    return `
      ${CourierInboxMenuButton.id} .menu-button-container {
        position: relative;
        display: inline-block;
      }
        
      ${CourierInboxMenuButton.id} #unread-badge {
        position: absolute;
        top: -8px;
        left: 50%;
        pointer-events: none;
      }
    `;
  }

  public onUnreadCountChange(unreadCount: number): void {
    this._unreadCountBadge?.setCount(unreadCount);
    this.refreshTheme();
  }

  private refreshTheme() {

    // Trigger button
    this._triggerButton?.updateIconColor(this.theme?.popup?.button?.icon?.color ?? CourierColors.black[500]);
    this._triggerButton?.updateIconSVG(this.theme?.popup?.button?.icon?.svg ?? CourierIconSVGs.inbox);
    this._triggerButton?.updateBackgroundColor(this.theme?.popup?.button?.backgroundColor ?? 'transparent');
    this._triggerButton?.updateHoverBackgroundColor(this.theme?.popup?.button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._triggerButton?.updateActiveBackgroundColor(this.theme?.popup?.button?.activeBackgroundColor ?? CourierColors.black[500_20]);

    // Unread count badge
    this._unreadCountBadge?.refreshTheme('button');

  }

}

registerElement(CourierInboxMenuButton);
