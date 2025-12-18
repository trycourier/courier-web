import { CourierColors, CourierFactoryElement, CourierIconButton, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
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
  private _unreadBadge?: HTMLDivElement;

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
    this.refreshTheme();
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

    // Create unread badge (red 4x4 circle)
    this._unreadBadge = document.createElement('div');
    this._unreadBadge.id = 'unread-badge';
    this._unreadBadge.style.display = 'none'; // Hidden by default

    this._container.appendChild(this._triggerButton);
    this._container.appendChild(this._unreadBadge);

    return this._container;
  }

  static getStyles(theme: CourierInboxTheme): string {
    return `
      ${CourierInboxMenuButton.id} {
        display: inline-block;
      }

      ${CourierInboxMenuButton.id} .menu-button-container {
        position: relative;
        display: inline-block;
      }
        
      ${CourierInboxMenuButton.id} .menu-button-container #unread-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        pointer-events: none;
        width: ${theme.popup?.button?.unreadDotIndicator?.width ?? '8px'};
        height: ${theme.popup?.button?.unreadDotIndicator?.height ?? '8px'};
        background: ${theme.popup?.button?.unreadDotIndicator?.backgroundColor ?? 'red'};
        border-radius: ${theme.popup?.button?.unreadDotIndicator?.borderRadius ?? '50%'};
        display: none;
        z-index: 1;
      }
    `;
  }

  public onUnreadCountChange(unreadCount: number): void {
    if (this._unreadBadge) {
      this._unreadBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    this.refreshTheme();
  }

  private refreshTheme() {
    this._style?.remove();
    this._style = injectGlobalStyle(CourierInboxMenuButton.id, CourierInboxMenuButton.getStyles(this.theme));
    this._triggerButton?.updateIconColor(this.theme?.popup?.button?.icon?.color ?? CourierColors.black[500]);
    this._triggerButton?.updateIconSVG(this.theme?.popup?.button?.icon?.svg ?? CourierIconSVGs.inbox);
    this._triggerButton?.updateBackgroundColor(this.theme?.popup?.button?.backgroundColor ?? 'transparent');
    this._triggerButton?.updateHoverBackgroundColor(this.theme?.popup?.button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._triggerButton?.updateActiveBackgroundColor(this.theme?.popup?.button?.activeBackgroundColor ?? CourierColors.black[500_20]);
  }

}

registerElement(CourierInboxMenuButton);
