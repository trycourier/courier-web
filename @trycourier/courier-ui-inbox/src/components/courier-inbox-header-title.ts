import { CourierColors, CourierIcon, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxMenuOption } from "./courier-inbox-filter-menu";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-bus";

export class CourierInboxHeaderTitle extends HTMLElement {

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _option: CourierInboxMenuOption;
  private _theme?: CourierInboxTheme;
  private _feedType?: CourierInboxFeedType;
  // Components
  private _titleElement: HTMLHeadingElement;
  private _iconElement: CourierIcon;
  private _unreadBadge: CourierUnreadCountBadge;
  private _container: HTMLDivElement;

  constructor(props: { themeBus: CourierInboxThemeManager, option: CourierInboxMenuOption }) {
    super();

    this._option = props.option;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.getStyles();

    this._container = document.createElement('div');
    this._container.className = 'title-section';

    this._iconElement = new CourierIcon();
    this._iconElement.setAttribute('svg', this._option.icon);

    this._titleElement = document.createElement('h2');
    this._unreadBadge = new CourierUnreadCountBadge({
      themeBus: props.themeBus,
      location: 'header'
    });

    this._container.appendChild(this._iconElement);
    this._container.appendChild(this._titleElement);
    this._container.appendChild(this._unreadBadge);

    shadow.appendChild(style);
    shadow.appendChild(this._container);

    this.update(props.option, 'inbox', 0);

    // Subscribe to the theme bus
    this._themeSubscription = props.themeBus.subscribe((theme: CourierInboxTheme) => {
      this.setTheme(theme, this._feedType ?? 'inbox');
    });

  }

  private getStyles(): string {
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
        font-family: var(--title-font-family);
        font-size: var(--title-font-size, 18px);
        font-weight: var(--title-font-weight, 500);
        color: var(--title-color, ${CourierColors.black[500]});
      }

      courier-unread-count-badge {
        margin-left: 4px;
      }
    `;
  }

  private setTheme(theme: CourierInboxTheme, feedType: CourierInboxFeedType) {
    this._theme = theme;
    this._feedType = feedType;
    this.style.setProperty('--title-color', theme.inbox?.header?.filters?.font?.color ?? CourierColors.black[500]);
    this.style.setProperty('--title-font-size', theme.inbox?.header?.filters?.font?.size ?? '18px');
    this.style.setProperty('--title-font-family', theme.inbox?.header?.filters?.font?.family ?? 'inherit');
    this.style.setProperty('--title-font-weight', theme.inbox?.header?.filters?.font?.weight ?? '500');
    this._unreadBadge.refreshTheme('header');
    this.updateFilter();
  }

  public update(option: CourierInboxMenuOption, feedType: CourierInboxFeedType, unreadCount: number) {
    this._option = option;
    this._feedType = feedType;
    this._titleElement.textContent = option.label;
    this._unreadBadge.setCount(unreadCount);
    this.updateFilter();
  }

  private updateFilter() {
    switch (this._feedType) {
      case 'inbox':
        this._titleElement.textContent = this._theme?.inbox?.header?.filters?.inbox?.text ?? 'Inbox';
        this._iconElement.updateSVG(this._theme?.inbox?.header?.filters?.inbox?.icon?.svg ?? CourierIconSource.inbox);
        this._iconElement.updateColor(this._theme?.inbox?.header?.filters?.inbox?.icon?.color ?? CourierColors.black[500]);
        break;
      case 'archive':
        this._titleElement.textContent = this._theme?.inbox?.header?.filters?.archive?.text ?? 'Archive';
        this._iconElement.updateSVG(this._theme?.inbox?.header?.filters?.archive?.icon?.svg ?? CourierIconSource.archive);
        this._iconElement.updateColor(this._theme?.inbox?.header?.filters?.archive?.icon?.color ?? CourierColors.black[500]);
        break;
    }
  }

  // Disconnect the theme subscription
  disconnectedCallback() {
    this._themeSubscription.remove();
  }

}

if (!customElements.get('courier-inbox-header-title')) {
  customElements.define('courier-inbox-header-title', CourierInboxHeaderTitle);
}