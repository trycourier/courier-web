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

  private _feed?: CourierInboxFeed;
  private _selectedTabId?: string;
  private _onTabClick: (tabId: string) => void;

  // Components
  private _style?: HTMLStyleElement;
  private _container?: HTMLDivElement;
  private _tabElements: Map<string, HTMLDivElement> = new Map();
  private _tabBadges: Map<string, CourierUnreadCountBadge> = new Map();

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: { themeManager: CourierInboxThemeManager, onTabClick: (tabId: string) => void }) {
    super();
    this._themeManager = props.themeManager;
    this._onTabClick = props.onTabClick;
    this._themeSubscription = props.themeManager.subscribe((_: CourierInboxTheme) => {
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

    if (this._feed) {
      for (let tab of this._feed.tabs) {
        const tabElement = this.createTab(tab);
        this._container.append(tabElement);
        this._tabElements.set(tab.id, tabElement);
      }
    }

    this.appendChild(this._container);

    // Set the theme of the button
    this.refreshTheme();

    return this._container;
  }

  static getStyles(theme: CourierInboxTheme): string {
    return `
      ${CourierInboxHeaderTabs.id} .tabs-container {
        display: flex;
        flex-direction: row;
        gap: 8px;
        padding: 0 16px;
      }

      ${CourierInboxHeaderTabs.id} .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        cursor: pointer;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s;
        margin: -1px;
      }

      ${CourierInboxHeaderTabs.id} .tab:hover {
        border-bottom-color: ${theme.inbox?.header?.backgroundColor ?? '#e0e0e0'};
      }

      ${CourierInboxHeaderTabs.id} .tab.selected {
        border-bottom-color: ${theme.inbox?.header?.filters?.inbox?.icon?.color ?? 'steelblue'};
      }

      ${CourierInboxHeaderTabs.id} .tab-label {
        font-size: 14px;
        color: ${theme.inbox?.header?.filters?.inbox?.icon?.color ?? '#000'};
      }
    `;
  }

  public setFeed(feed: CourierInboxFeed) {
    // Only rebuild if the feed has actually changed
    const feedChanged = this._feed?.id !== feed.id;
    this._feed = feed;

    // If component is already mounted and feed changed, rebuild the tabs
    if (this._container && feedChanged) {
      this.rebuild();
    }
  }

  public setSelectedTab(tabId: string) {
    this._selectedTabId = tabId;
    this.updateTabStyles();
  }

  public updateTabUnreadCount(tabId: string, count: number) {
    const badge = this._tabBadges.get(tabId);
    if (badge) {
      badge.setCount(count);
    }
  }

  public setVisible(visible: boolean) {
    if (this._container) {
      this._container.style.display = visible ? 'flex' : 'none';
    }
  }

  private refreshTheme() {
    if (this._style) {
      this._style.textContent = CourierInboxHeaderTabs.getStyles(this.theme);
    }
  }

  private updateTabStyles() {
    for (let [tabId, tabElement] of this._tabElements) {
      if (tabId === this._selectedTabId) {
        tabElement.classList.add('selected');
      } else {
        tabElement.classList.remove('selected');
      }
    }
  }

  private createTab(tab: CourierInboxTab): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'tab';
    if (tab.id === this._selectedTabId) {
      el.classList.add('selected');
    }

    const label = document.createElement('div');
    label.className = 'tab-label';
    label.innerText = tab.label;

    const unreadBadge = new CourierUnreadCountBadge({ themeBus: this._themeManager, location: 'header' });
    this._tabBadges.set(tab.id, unreadBadge);

    el.appendChild(label);
    el.appendChild(unreadBadge);

    el.addEventListener('click', () => {
      this._onTabClick(tab.id);
    });

    return el;
  }

  private rebuild() {
    // Clear existing tabs
    this._tabElements.clear();
    this._tabBadges.clear();
    if (this._container) {
      this._container.innerHTML = '';
    }

    // Rebuild tabs
    if (this._feed && this._container) {
      for (let tab of this._feed.tabs) {
        const tabElement = this.createTab(tab);
        this._container.append(tabElement);
        this._tabElements.set(tab.id, tabElement);
      }
    }
  }

}

registerElement(CourierInboxHeaderTabs);
