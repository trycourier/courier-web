import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTab } from "../types/inbox-data-set";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxTabs extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-header-tabs';
  }

  // Theme
  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;

  private _selectedTabId?: string;
  private _tabs: CourierInboxTab[] = [];
  private _onTabClick: (tab: CourierInboxTab) => void;
  private _onTabReselected: (tab: CourierInboxTab) => void;

  // Components
  private _style?: HTMLStyleElement;

  get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: { themeManager: CourierInboxThemeManager, onTabClick: (tab: CourierInboxTab) => void, onTabReselected: (tab: CourierInboxTab) => void }) {
    super();
    this._themeManager = props.themeManager;
    this._onTabClick = props.onTabClick;
    this._onTabReselected = props.onTabReselected;
    this._themeSubscription = props.themeManager.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme();
    });
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxTabs.id, CourierInboxTabs.getStyles(this.theme));
    this.render();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private render() {
    // Clear the existing tabs
    this.innerHTML = '';

    // Create the tab elements
    for (let tab of this._tabs) {
      const tabElement = this.createTab(tab);
      this.appendChild(tabElement);
    }

    // Set the theme of the button
    this.refreshTheme();
  }

  static getStyles(theme: CourierInboxTheme): string {
    const tabs = theme.inbox?.header?.tabs;

    return `
      ${CourierInboxTabs.id} {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 8px;
        height: 44px;
        padding: 0 12px;
        margin-top: -6px;
      }

      ${CourierInboxTabs.id} .tab-container {
        margin-top: 1px;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      ${CourierInboxTabs.id} .tab {
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        border-bottom: ${tabs?.default?.indicatorHeight ?? '1px'} solid ${tabs?.default?.indicatorColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-container:hover {
        background-color: ${tabs?.default?.hoverBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-container:active {
        background-color: ${tabs?.default?.activeBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab.selected {
        border-bottom: ${tabs?.selected?.indicatorHeight ?? '1px'} solid ${tabs?.selected?.indicatorColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-container:hover.selected {
        background-color: ${tabs?.selected?.hoverBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-container:active.selected {
        background-color: ${tabs?.selected?.activeBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-label {
        font-size: ${tabs?.default?.font?.size ?? '14px'};
        font-family: ${tabs?.default?.font?.family ?? 'inherit'};
        font-weight: ${tabs?.default?.font?.weight ?? 'inherit'};
        color: ${tabs?.default?.font?.color ?? 'red'};
      }

      ${CourierInboxTabs.id} .tab.selected .tab-label {
        color: ${tabs?.selected?.font?.color ?? 'red'};
      }
    `;
  }

  public setTabs(tabs: CourierInboxTab[]) {
    this._tabs = tabs;
    this.render();
  }

  public setSelectedTab(tabId: string) {
    this._selectedTabId = tabId;
    this.updateTabStyles();
    this.updateBadgeStates();
  }

  public updateTabUnreadCount(tabId: string, count: number) {
    // const badge = this._tabBadges.get(tabId);
    // if (badge) {
    //   badge.setCount(count);
    // }
  }

  private refreshTheme() {
    if (this._style) {
      this._style.textContent = CourierInboxTabs.getStyles(this.theme);
    }
  }

  private updateTabStyles() {
    for (let child of Array.from(this.children)) {
      if (child instanceof HTMLElement && child.classList.contains('tab-container')) {
        const tabId = child.getAttribute('data-tab-id');
        const tabElement = child.querySelector('.tab');
        if (tabElement instanceof HTMLElement) {
          if (tabId === this._selectedTabId) {
            tabElement.classList.add('selected');
          } else {
            tabElement.classList.remove('selected');
          }
        }
      }
    }
  }

  private updateBadgeStates() {
    // for (let [tabId, badge] of this._tabBadges) {
    //   badge.setActive(tabId === this._selectedTabId);
    // }
  }

  private createTab(tab: CourierInboxTab): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'tab-container';
    container.setAttribute('data-tab-id', tab.id);

    const el = document.createElement('div');
    el.className = 'tab';
    if (tab.id === this._selectedTabId) {
      el.classList.add('selected');
    }

    const label = document.createElement('div');
    label.className = 'tab-label';
    label.innerText = tab.title;

    const unreadBadge = new CourierUnreadCountBadge({ themeBus: this._themeManager });

    el.appendChild(label);
    el.appendChild(unreadBadge);
    container.appendChild(el);

    container.addEventListener('click', () => {
      if (tab.id === this._selectedTabId) {
        this._onTabReselected(tab);
      } else {
        this._onTabClick(tab);
      }
    });

    return container;
  }

}

registerElement(CourierInboxTabs);
