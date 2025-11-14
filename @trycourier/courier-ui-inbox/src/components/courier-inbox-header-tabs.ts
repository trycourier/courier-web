import { CourierColors, CourierFactoryElement, CourierIconButton, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxFeed, CourierInboxTab } from "../types/inbox-data-set";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxHeaderTabs extends CourierFactoryElement {

  static get id(): string {
    return 'courier-inbox-header-tabs';
  }

  // Theme
  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;

  private _feed: CourierInboxFeed;
  private _selectedTabId: string;

  // Components
  private _style?: HTMLStyleElement;
  private _container?: HTMLDivElement;
  private _unreadBadge?: HTMLDivElement;

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(themeManager: CourierInboxThemeManager) {
    super();
    this._themeManager = themeManager;
    this._themeSubscription = themeManager.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme();
    });
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxHeaderTabs.id, CourierInboxHeaderTabs.getStyles(this.theme));
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  defaultElement(): HTMLElement {

    this._container = document.createElement('div');
    this._container.className = 'tabs-container';

    for (let tab of this._feed.tabs) {
      this._container.append(this.createTab(tab));
    }

    this.appendChild(this._container);

    // Set the theme of the button
    this.refreshTheme();

    return this._container;
  }

  static getStyles(theme: CourierInboxTheme): string {
    return `
      ${CourierInboxHeaderTabs.id} .tabs-container {
        position: relative;
        display: inline-block;
      }

      ${CourierInboxHeaderTabs.id} .unread-count {
        position: absolute;
        top: 2px;
        right: 2px;
        pointer-events: none;
        display: none;
        z-index: 1;
      }
    `;
  }

  public onUnreadCountChange(unreadCount: number): void {
    if (this._unreadBadge) {
      this._unreadBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    // Optionally, update theme if needed
    this.refreshTheme();
  }

  private refreshTheme() {

  }

  private createTab(tab: CourierInboxTab) {
    const el = document.createElement('div');
    el.className = 'tab';

    const label = document.createElement('div');
    label.innerText = tab.label;

    const unreadCound = new CourierUnreadCountBadge({ themeBus: this._themeManager, location: 'header' });
    el.appendChild(unreadCound);

    return el;
  }

}

registerElement(CourierInboxHeaderTabs);
