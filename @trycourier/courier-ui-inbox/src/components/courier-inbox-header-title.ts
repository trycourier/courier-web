import { CourierIcon, CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxMenuOption } from "./courier-inbox-option-menu";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";

export class CourierInboxHeaderTitle extends HTMLElement {

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _option: CourierInboxMenuOption;
  private _feedType?: CourierInboxFeedType;

  // Components
  private _titleElement: HTMLHeadingElement;
  private _iconElement: CourierIcon;
  private _unreadBadge: CourierUnreadCountBadge;
  private _container: HTMLDivElement;
  private _style: HTMLStyleElement;

  constructor(themeManager: CourierInboxThemeManager, option: CourierInboxMenuOption) {
    super();

    this._option = option;
    const shadow = this.attachShadow({ mode: 'open' });

    this._style = document.createElement('style');

    this._container = document.createElement('div');
    this._container.className = 'title-section';

    this._iconElement = new CourierIcon(undefined, this._option.icon.svg);

    this._titleElement = document.createElement('h2');
    this._unreadBadge = new CourierUnreadCountBadge({
      themeBus: themeManager,
      location: 'header'
    });

    this._container.appendChild(this._iconElement);
    this._container.appendChild(this._titleElement);
    this._container.appendChild(this._unreadBadge);

    shadow.appendChild(this._style);
    shadow.appendChild(this._container);

    // Subscribe to the theme bus
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme(this._feedType ?? 'inbox');
    });

    this.refreshTheme(this._feedType ?? 'inbox');

  }

  private getStyles(): string {

    const theme = this._themeSubscription.manager.getTheme();

    return `
      .title-section {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
      }

      courier-icon {
        display: flex;
        align-items: center;
      }

      h2 {
        margin: 0;
        font-family: ${theme.inbox?.header?.filters?.font?.family ?? 'inherit'};
        font-size: ${theme.inbox?.header?.filters?.font?.size ?? '18px'};
        font-weight: ${theme.inbox?.header?.filters?.font?.weight ?? '500'};
        color: ${theme.inbox?.header?.filters?.font?.color ?? 'red'};
      }

      courier-unread-count-badge {
        margin-left: 4px;
      }
    `;
  }

  private refreshTheme(feedType: CourierInboxFeedType) {
    this._feedType = feedType;
    this._style.textContent = this.getStyles();
    this._unreadBadge.refreshTheme('header');
    this.updateFilter();
  }

  public updateSelectedOption(option: CourierInboxMenuOption, feedType: CourierInboxFeedType, unreadCount: number) {
    this._option = option;
    this._feedType = feedType;
    this._unreadBadge.setCount(unreadCount);
    this.updateFilter();
  }

  private updateFilter() {
    const theme = this._themeSubscription.manager.getTheme();
    switch (this._feedType) {
      case 'inbox':
        this._titleElement.textContent = theme.inbox?.header?.filters?.inbox?.text ?? 'Inbox';
        this._iconElement.updateSVG(theme.inbox?.header?.filters?.inbox?.icon?.svg ?? CourierIconSVGs.inbox);
        this._iconElement.updateColor(theme.inbox?.header?.filters?.inbox?.icon?.color ?? 'red');
        break;
      case 'archive':
        this._titleElement.textContent = theme.inbox?.header?.filters?.archive?.text ?? 'Archive';
        this._iconElement.updateSVG(theme.inbox?.header?.filters?.archive?.icon?.svg ?? CourierIconSVGs.archive);
        this._iconElement.updateColor(theme.inbox?.header?.filters?.archive?.icon?.color ?? 'red');
        break;
    }
  }

  // Disconnect the theme subscription
  disconnectedCallback() {
    this._themeSubscription.unsubscribe();
  }

}

if (!customElements.get('courier-inbox-header-title')) {
  customElements.define('courier-inbox-header-title', CourierInboxHeaderTitle);
}