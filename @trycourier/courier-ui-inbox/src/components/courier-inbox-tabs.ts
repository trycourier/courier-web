import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTab } from "../types/inbox-data-set";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxTabs extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-tabs';
  }

  // Theme
  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;

  private _selectedTabId?: string;
  private _tabs: CourierInboxTab[] = [];
  private _onTabClick: (tab: CourierInboxTab) => void;
  private _onTabReselected: (tab: CourierInboxTab) => void;
  private _tabBadges: Map<string, CourierUnreadCountBadge> = new Map();

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

    // Create a single container that holds all tabs
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';

    // Create the tab elements inside the container
    for (let tab of this._tabs) {
      const tabElement = this.createTab(tab);
      tabContainer.appendChild(tabElement);
    }

    // Append the container to the main element
    this.appendChild(tabContainer);

    // Set the theme of the button
    this.refreshTheme();
  }

  static getStyles(theme: CourierInboxTheme): string {
    const tabs = theme.inbox?.header?.tabs;

    // Helper function to convert borderRadius to CSS
    const getBorderRadius = (borderRadius?: string | { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string }): string => {
      if (!borderRadius) return '';
      if (typeof borderRadius === 'string') {
        return `border-radius: ${borderRadius};`;
      }
      const parts: string[] = [];
      if (borderRadius.topLeft) parts.push(borderRadius.topLeft);
      else parts.push('0');
      if (borderRadius.topRight) parts.push(borderRadius.topRight);
      else parts.push('0');
      if (borderRadius.bottomRight) parts.push(borderRadius.bottomRight);
      else parts.push('0');
      if (borderRadius.bottomLeft) parts.push(borderRadius.bottomLeft);
      else parts.push('0');
      return `border-radius: ${parts.join(' ')};`;
    };

    return `
      ${CourierInboxTabs.id} {
        position: relative;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        margin-top: -5px;
        overflow-x: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        height: 41px;
      }

      ${CourierInboxTabs.id}::-webkit-scrollbar {
        display: none;
      }

      ${CourierInboxTabs.id} .tab-container {
        display: flex;
        flex-direction: row;
        gap: 4px;
        padding: 0 10px;
        width: fit-content;
        height: 100%;
      }

      ${CourierInboxTabs.id} .tab-item {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: ${tabs?.transition ?? 'all 0.2s ease'};
        user-select: none;
        padding: 0 10px;
        flex-shrink: 0;
        height: 100%;
        ${getBorderRadius(tabs?.borderRadius)}
      }

      ${CourierInboxTabs.id} .tab {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: ${tabs?.default?.indicatorHeight ?? '1px'} solid ${tabs?.default?.indicatorColor ?? 'transparent'};
        height: 40px;
        min-width: 40px;
        justify-content: center;
        position: relative;
      }

      ${CourierInboxTabs.id} .tab-item:hover {
        background-color: ${tabs?.default?.hoverBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-item:active {
        background-color: ${tabs?.default?.activeBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab.selected {
        border-bottom: ${(tabs?.selected?.indicatorHeight ?? '1px')} solid ${(tabs?.selected?.indicatorColor ?? 'transparent')};
      }

      ${CourierInboxTabs.id} .tab-item:hover.selected {
        background-color: ${tabs?.selected?.hoverBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-item:active.selected {
        background-color: ${tabs?.selected?.activeBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxTabs.id} .tab-label {
        font-size: ${tabs?.default?.font?.size ?? '14px'};
        font-family: ${tabs?.default?.font?.family ?? 'inherit'};
        font-weight: ${tabs?.default?.font?.weight ?? 'inherit'};
        color: ${tabs?.default?.font?.color ?? 'red'};
        user-select: none;
        white-space: nowrap;
      }

      ${CourierInboxTabs.id} .tab.selected .tab-label {
        color: ${tabs?.selected?.font?.color ?? 'red'};
      }
    `;
  }

  public setTabs(tabs: CourierInboxTab[]) {
    this._tabs = tabs;
    this._tabBadges.clear(); // Clear existing badges when tabs are reset
    this.render();
  }

  public setSelectedTab(tabId: string) {
    this._selectedTabId = tabId;
    this.reloadTabs();
    this.updateBadgeStates();
  }

  public updateTabUnreadCount(tabId: string, count: number) {
    const badge = this._tabBadges.get(tabId);
    if (badge) {
      badge.setCount(count);
    }
  }

  public scrollToStart(animate: boolean = true) {
    if (animate) {
      this.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } else {
      this.scrollLeft = 0;
    }
  }

  private refreshTheme() {
    if (this._style) {
      this._style.textContent = CourierInboxTabs.getStyles(this.theme);
    }
  }

  private reloadTabs() {
    const tabContainer = this.querySelector('.tab-container');
    if (!tabContainer) return;

    for (let child of Array.from(tabContainer.children)) {
      if (child instanceof HTMLElement && child.classList.contains('tab-item')) {
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
    for (let [tabId, badge] of this._tabBadges) {
      badge.setActive(tabId === this._selectedTabId);
    }
  }

  private createTab(tab: CourierInboxTab): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'tab-item';
    container.setAttribute('data-tab-id', tab.id);

    const el = document.createElement('div');
    el.className = 'tab';
    if (tab.id === this._selectedTabId) {
      el.classList.add('selected');
    }

    const label = document.createElement('div');
    label.className = 'tab-label';
    label.innerText = tab.title;

    const unreadBadge = new CourierUnreadCountBadge({
      themeBus: this._themeManager,
      location: "tab"
    });
    this._tabBadges.set(tab.id, unreadBadge);

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
