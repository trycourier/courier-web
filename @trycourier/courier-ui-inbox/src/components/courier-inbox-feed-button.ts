import { CourierBaseElement, CourierIcon, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeed } from "../types/inbox-data-set";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxFeedButton extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-header-title';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _feeds: CourierInboxFeed[];
  private _selectedFeed?: CourierInboxFeed;

  get selectedFeed(): CourierInboxFeed | undefined {
    return this._selectedFeed;
  }

  // Components
  private _style?: HTMLStyleElement;
  private _iconElement?: CourierIcon;
  private _titleElement?: HTMLHeadingElement;
  private _switchIconElement?: CourierIcon;
  private _unreadBadge?: CourierUnreadCountBadge;

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(themeManager: CourierInboxThemeManager, feeds: CourierInboxFeed[]) {
    super();

    this._feeds = feeds;

    // Subscribe to the theme bus
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme();
    });

  }

  private getStyles(theme: CourierInboxTheme): string {
    const hasMultipleFeeds = this._feeds.length > 1;
    const hoverStyle = hasMultipleFeeds
      ? `${CourierInboxFeedButton.id}:hover {
        background: ${theme.inbox?.header?.feedButton?.hoverBackgroundColor ?? 'red'};
      }`
      : '';
    const activeStyle = hasMultipleFeeds
      ? `${CourierInboxFeedButton.id}:active {
        background: ${theme.inbox?.header?.feedButton?.activeBackgroundColor ?? 'red'};
      }`
      : '';

    return `
      ${CourierInboxFeedButton.id} {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        transition: background 0.2s;
        border-radius: 6px;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 4px;
        padding-right: 8px;
      }

      ${hoverStyle}

      ${activeStyle}

      ${CourierInboxFeedButton.id} courier-icon {
        display: flex;
        align-items: center;
      }

      ${CourierInboxFeedButton.id} .title-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0px;
      }

      ${CourierInboxFeedButton.id} .title-container h2 {
        margin: 0;
        font-family: ${theme.inbox?.header?.feedButton?.font?.family ?? 'inherit'};
        font-size: ${theme.inbox?.header?.feedButton?.font?.size ?? '16px'};
        font-weight: ${theme.inbox?.header?.feedButton?.font?.weight ?? '500'};
        color: ${theme.inbox?.header?.feedButton?.font?.color ?? 'red'};
      }

    `;
  }

  onComponentMounted() {
    this.render();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private render() {
    this._style = injectGlobalStyle(CourierInboxFeedButton.id, this.getStyles(this.theme));

    // Icon
    this._iconElement = new CourierIcon();
    this.appendChild(this._iconElement);

    // Title wrapped in a div
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    this._titleElement = document.createElement('h2');
    titleContainer.appendChild(this._titleElement);

    // Switch icon
    const switchIcon = this.theme.inbox?.header?.feedButton?.menuDropDownIcon;
    this._switchIconElement = new CourierIcon(switchIcon?.color ?? 'red', switchIcon?.svg ?? CourierIconSVGs.chevronDown);
    this._switchIconElement.style.display = this._feeds.length > 1 ? 'flex' : 'none';
    titleContainer.appendChild(this._switchIconElement);

    this.appendChild(titleContainer);

    // Unread badge
    this._unreadBadge = new CourierUnreadCountBadge({
      themeBus: this._themeSubscription.manager,
      location: "feed"
    });
    this.appendChild(this._unreadBadge);

    // Refresh theme
    this.refreshTheme();
  }

  public setUnreadCount(count: number) {
    this._unreadBadge?.setCount(count);
  }

  public setFeeds(feeds: CourierInboxFeed[]) {
    this._feeds = feeds;
    if (this._switchIconElement) {
      this._switchIconElement.style.display = this._feeds.length > 1 ? 'flex' : 'none';
    }
    // Refresh theme to update hover/active styles based on feed count
    this.refreshTheme();
  }

  public setSelectedFeed(feedId: string) {
    this._selectedFeed = this._feeds.find(feed => feed.id === feedId);
    this.refreshSelectedFeed();
  }

  private refreshTheme() {
    if (this._style) {
      this._style.textContent = this.getStyles(this.theme);
    }
    this.refreshSelectedFeed();
    this.refreshSwitchIcon();
    this.refreshUnreadBadge();
  }

  private refreshSelectedFeed() {
    if (this._selectedFeed) {
      this._iconElement?.updateSVG(this._selectedFeed.iconSVG ?? CourierIconSVGs.inbox);
      this._iconElement?.updateColor(this.theme.inbox?.header?.feedButton?.currentFeedIconColor ?? 'red');
      if (this._titleElement) {
        this._titleElement.textContent = this._selectedFeed.title;
      }
    }
  }

  private refreshSwitchIcon() {
    if (this._switchIconElement) {
      const switchIcon = this.theme.inbox?.header?.feedButton?.menuDropDownIcon;
      this._switchIconElement.updateSVG(switchIcon?.svg ?? CourierIconSVGs.chevronDown);
      this._switchIconElement.updateColor(switchIcon?.color ?? 'red');
    }
  }

  private refreshUnreadBadge() {
    if (this._unreadBadge) {
      this._unreadBadge.refreshTheme();
    }
  }

}

registerElement(CourierInboxFeedButton);
