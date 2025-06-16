import { CourierBaseElement, CourierIcon, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxMenuOption } from "./courier-inbox-option-menu";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";

export class CourierInboxHeaderTitle extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-header-title';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _option: CourierInboxMenuOption;
  private _feedType?: CourierInboxFeedType;

  // Components
  private _style?: HTMLStyleElement;
  private _titleElement?: HTMLHeadingElement;
  private _iconElement?: CourierIcon;
  private _unreadBadge?: CourierUnreadCountBadge;

  constructor(themeManager: CourierInboxThemeManager, option: CourierInboxMenuOption) {
    super();

    this._option = option;

    // Subscribe to the theme bus
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme(this._feedType ?? 'inbox');
    });

  }

  getStyles(): string {
    const theme = this._themeSubscription.manager.getTheme();

    return `
      ${CourierInboxHeaderTitle.id} {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
      }

      ${CourierInboxHeaderTitle.id} courier-icon {
        display: flex;
        align-items: center;
      }

      ${CourierInboxHeaderTitle.id} h2 {
        margin: 0;
        font-family: ${theme.inbox?.header?.filters?.font?.family ?? 'inherit'};
        font-size: ${theme.inbox?.header?.filters?.font?.size ?? '18px'};
        font-weight: ${theme.inbox?.header?.filters?.font?.weight ?? '500'};
        color: ${theme.inbox?.header?.filters?.font?.color ?? 'red'};
      }

      ${CourierInboxHeaderTitle.id} courier-unread-count-badge {
        margin-left: 4px;
      }
    `;
  }

  onComponentMounted() {

    this._style = injectGlobalStyle(CourierInboxHeaderTitle.id, this.getStyles());

    this._iconElement = new CourierIcon(undefined, this._option.icon.svg);
    this._titleElement = document.createElement('h2');
    this._unreadBadge = new CourierUnreadCountBadge({
      themeBus: this._themeSubscription.manager,
      location: 'header'
    });

    this.appendChild(this._iconElement);
    this.appendChild(this._titleElement);
    this.appendChild(this._unreadBadge);

    this.refreshTheme(this._feedType ?? 'inbox');

  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private refreshTheme(feedType: CourierInboxFeedType) {
    this._feedType = feedType;
    if (this._style) {
      this._style.textContent = this.getStyles();
    }
    this._unreadBadge?.refreshTheme('header');
    this.updateFilter();
  }

  public updateSelectedOption(option: CourierInboxMenuOption, feedType: CourierInboxFeedType, unreadCount: number) {
    this._option = option;
    this._feedType = feedType;
    this._unreadBadge?.setCount(unreadCount);
    this.updateFilter();
  }

  private updateFilter() {
    const theme = this._themeSubscription.manager.getTheme();
    switch (this._feedType) {
      case 'inbox':
        if (this._titleElement) {
          this._titleElement.textContent = theme.inbox?.header?.filters?.inbox?.text ?? 'Inbox';
        }
        this._iconElement?.updateSVG(theme.inbox?.header?.filters?.inbox?.icon?.svg ?? CourierIconSVGs.inbox);
        this._iconElement?.updateColor(theme.inbox?.header?.filters?.inbox?.icon?.color ?? 'red');
        break;
      case 'archive':
        if (this._titleElement) {
          this._titleElement.textContent = theme.inbox?.header?.filters?.archive?.text ?? 'Archive';
        }
        this._iconElement?.updateSVG(theme.inbox?.header?.filters?.archive?.icon?.svg ?? CourierIconSVGs.archive);
        this._iconElement?.updateColor(theme.inbox?.header?.filters?.archive?.icon?.color ?? 'red');
        break;
    }
  }
}

registerElement(CourierInboxHeaderTitle);