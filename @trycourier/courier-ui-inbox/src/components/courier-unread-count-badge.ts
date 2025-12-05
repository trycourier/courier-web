import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";

export class CourierUnreadCountBadge extends CourierBaseElement {

  static get id(): string {
    return 'courier-unread-count-badge';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _count: number = 0;

  // Elements
  private _style?: HTMLStyleElement;

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: { themeBus: CourierInboxThemeManager }) {
    super();
    this._themeSubscription = props.themeBus.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme();
    });
  }

  onComponentMounted() {
    // Inject styles
    this._style = document.createElement('style');
    this._style.textContent = CourierUnreadCountBadge.getStyles(this.theme);
    document.head.appendChild(this._style);

    this.setActive(true);
    this.updateBadge();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  static getStyles(theme: CourierInboxTheme): string {
    return `
      ${CourierUnreadCountBadge.id} {
        display: none;
        pointer-events: none;
      }

      ${CourierUnreadCountBadge.id}.active {
        background-color: ${theme.inbox?.header?.feeds?.unreadIndicator?.backgroundColor};
        color: ${theme.inbox?.header?.feeds?.unreadIndicator?.font?.color};
        border-radius: ${theme.inbox?.header?.feeds?.unreadIndicator?.borderRadius};
        font-size: ${theme.inbox?.header?.feeds?.unreadIndicator?.font?.size};
        padding: ${theme.inbox?.header?.feeds?.unreadIndicator?.padding};
      }

      ${CourierUnreadCountBadge.id}.inactive {
        background-color: ${theme.inbox?.header?.feeds?.inactiveUnreadIndicator?.backgroundColor};
        color: ${theme.inbox?.header?.feeds?.inactiveUnreadIndicator?.font?.color};
        border-radius: ${theme.inbox?.header?.feeds?.inactiveUnreadIndicator?.borderRadius};
        font-size: ${theme.inbox?.header?.feeds?.inactiveUnreadIndicator?.font?.size};
        padding: ${theme.inbox?.header?.feeds?.inactiveUnreadIndicator?.padding};
      }
    `
  }

  public setCount(count: number) {
    this._count = count;
    this.updateBadge();
  }

  public setActive(active: boolean) {
    this.className = active ? 'active' : 'inactive';
    this.updateBadge();
  }

  public refreshTheme() {
    this.updateBadge();
  }

  private updateBadge() {
    if (this._count > 0) {
      this.textContent = this._count > 99 ? '99+' : this._count.toString();
      this.style.display = 'inline-block';
    } else {
      this.textContent = '';
      this.style.display = 'none';
    }
  }
}

registerElement(CourierUnreadCountBadge);
