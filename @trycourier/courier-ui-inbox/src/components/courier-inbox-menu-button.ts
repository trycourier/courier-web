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

  // State
  private _unreadCount: number = 0;

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

    // Create unread badge (red 4x4 circle)
    this._unreadBadge = document.createElement('div');
    this._unreadBadge.className = 'unread-badge';
    this._unreadBadge.style.display = "none"; // Hide by default

    this._container.appendChild(this._triggerButton);
    this._container.appendChild(this._unreadBadge);
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
        
      ${CourierInboxMenuButton.id} .unread-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        pointer-events: none;
        width: 8px;
        height: 8px;
        background: #FF3B30;
        border-radius: 50%;
        display: none;
        z-index: 1;
      }
    `;
  }

  public onUnreadCountChange(unreadCount: number): void {
    this._unreadCount = unreadCount;
    if (this._unreadBadge) {
      if (unreadCount > 0) {
        this._unreadBadge.style.display = "block";
      } else {
        this._unreadBadge.style.display = "none";
      }
    }
    // Optionally, update theme if needed
    this.refreshTheme();
  }

  private refreshTheme() {
    this._triggerButton?.updateIconColor(this.theme?.popup?.button?.icon?.color ?? CourierColors.black[500]);
    this._triggerButton?.updateIconSVG(this.theme?.popup?.button?.icon?.svg ?? CourierIconSVGs.inbox);
    this._triggerButton?.updateBackgroundColor(this.theme?.popup?.button?.backgroundColor ?? 'transparent');
    this._triggerButton?.updateHoverBackgroundColor(this.theme?.popup?.button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._triggerButton?.updateActiveBackgroundColor(this.theme?.popup?.button?.activeBackgroundColor ?? CourierColors.black[500_20]);
  }

}

registerElement(CourierInboxMenuButton);
