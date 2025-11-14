import { CourierInboxFeedType } from "../types/feed-type";
import { CourierIconSVGs, CourierFactoryElement, registerElement, CourierColors, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierInboxOptionMenu, CourierInboxMenuOption } from "./courier-inbox-option-menu";
import { CourierInboxHeaderTitle } from "./courier-inbox-header-title";
import { CourierInboxHeaderFactoryProps } from "../types/factories";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeed } from "../types/inbox-data-set";
import { CourierInboxHeaderTabs } from "./courier-inbox-header-tabs";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export type CourierInboxHeaderMenuItemId = CourierInboxFeedType | 'markAllRead' | 'archiveAll' | 'archiveRead' | string;

export class CourierInboxHeader extends CourierFactoryElement {

  static get id(): string {
    return 'courier-inbox-header';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _activeFeedId: CourierInboxFeedType | string = 'inbox';
  private _unreadCount: number = 0;
  private _feeds: CourierInboxFeed[] = [];

  // Components
  private _titleComponent?: CourierInboxHeaderTitle;
  private _filterMenu?: CourierInboxOptionMenu;
  private _actionMenu?: CourierInboxOptionMenu;
  private _tabsComponent?: CourierInboxHeaderTabs;
  private _unreadBadge?: CourierUnreadCountBadge;
  private _style?: HTMLStyleElement;

  // Callbacks
  private _onFeedTypeChange: (feedType: CourierInboxFeedType | string) => void;
  private _onTabChange: (tabId: string) => void;

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: {
    themeManager: CourierInboxThemeManager,
    onFeedTypeChange: (feedType: CourierInboxFeedType | string) => void,
    onTabChange: (tabId: string) => void
  }) {
    super();

    // Subscribe to the theme bus
    this._themeSubscription = props.themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Set the callbacks
    this._onFeedTypeChange = props.onFeedTypeChange;
    this._onTabChange = props.onTabChange;
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxHeader.id, CourierInboxHeader.getStyles(this.theme));
  }

  onComponentUmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private getFeedOptions(): CourierInboxMenuOption[] {
    const theme = this._themeSubscription.manager.getTheme();
    const filterMenu = theme.inbox?.header?.menus?.filters;

    return this._feeds.map(feed => {
      // 'archive' is a special cased feed that gets its own icon
      if (feed.id === 'archive') {
        return {
          id: feed.id,
          text: feed.label,
          icon: {
            color: filterMenu?.archive?.icon?.color ?? 'red',
            svg: filterMenu?.archive?.icon?.svg ?? CourierIconSVGs.archive
          },
          selectionIcon: {
            color: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.color ?? 'red',
            svg: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.svg ?? CourierIconSVGs.check
          },
          onClick: (option: CourierInboxMenuOption) => {
            this.handleOptionMenuItemClick(feed.id, option);
          }
        }
      }

      return {
        id: feed.id,
        text: feed.label,
        icon: {
          color: filterMenu?.inbox?.icon?.color ?? 'red',
          svg: filterMenu?.inbox?.icon?.svg ?? CourierIconSVGs.inbox
        },
        selectionIcon: {
          color: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.color ?? 'red',
          svg: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.svg ?? CourierIconSVGs.check
        },
        onClick: (option: CourierInboxMenuOption) => {
          this.handleOptionMenuItemClick(feed.id, option);
        }
      }
    });
  }

  private getActionOptions(): CourierInboxMenuOption[] {
    const theme = this._themeSubscription.manager.getTheme();
    const actionMenu = theme.inbox?.header?.menus?.actions;

    return [
      {
        id: 'markAllRead',
        text: actionMenu?.markAllRead?.text ?? 'Mark All as Read',
        icon: {
          color: actionMenu?.markAllRead?.icon?.color ?? 'red',
          svg: actionMenu?.markAllRead?.icon?.svg ?? CourierIconSVGs.inbox
        },
        selectionIcon: null,
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.readAllMessages();
        }
      },
      {
        id: 'archiveAll',
        text: actionMenu?.archiveAll?.text ?? 'Archive All',
        icon: {
          color: actionMenu?.archiveAll?.icon?.color ?? 'red',
          svg: actionMenu?.archiveAll?.icon?.svg ?? CourierIconSVGs.archive
        },
        selectionIcon: null,
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.archiveAllMessages();
        }
      },
      {
        id: 'archiveRead',
        text: actionMenu?.archiveRead?.text ?? 'Archive Read',
        icon: {
          color: actionMenu?.archiveRead?.icon?.color ?? 'red',
          svg: actionMenu?.archiveRead?.icon?.svg ?? CourierIconSVGs.archive
        },
        selectionIcon: null,
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.archiveReadMessages();
        }
      }
    ];
  }

  private refreshTheme() {

    if (this._style) {
      this._style.textContent = CourierInboxHeader.getStyles(this.theme);
    }

    // Update menus
    this._filterMenu?.setOptions(this.getFeedOptions());
    this._actionMenu?.setOptions(this.getActionOptions());
  }

  private handleOptionMenuItemClick(feedType: CourierInboxFeedType | string, option: CourierInboxMenuOption) {
    this._activeFeedId = feedType;
    if (this._titleComponent) {
      this._titleComponent.updateSelectedOption(option, this._activeFeedId);
    }

    // Update tabs to show the active feed's tabs
    const activeFeed = this._feeds.find(feed => feed.id === this._activeFeedId);
    if (activeFeed) {
      this._tabsComponent?.setFeed(activeFeed);
    }

    this._onFeedTypeChange(feedType);
  }

  public render(props: CourierInboxHeaderFactoryProps): void {
    this._activeFeedId = props.feedType;
    this._unreadCount = props.unreadCount;

    const feedOption = this.getFeedOptions().find(opt => opt.id === this._activeFeedId);
    const activeFeed = this._feeds.find(feed => feed.id === this._activeFeedId);
    const hasMultipleTabs = (activeFeed?.tabs.length ?? 0) > 1;

    if (feedOption) {
      this._titleComponent?.updateSelectedOption(feedOption, this._activeFeedId);
      this._filterMenu?.selectOption(feedOption);
    }

    // Update unread badge - hide if there are multiple tabs
    const unreadCount = hasMultipleTabs ? 0 : this._unreadCount;
    this._unreadBadge?.setCount(unreadCount);
    this._unreadBadge?.setActive(true);

    // Update tabs for the active feed
    if (activeFeed) {
      this._tabsComponent?.setFeed(activeFeed);
      // Show/hide tabs based on whether there are multiple tabs
      this._tabsComponent?.setVisible(hasMultipleTabs);
    }
  }

  public updateTabUnreadCount(tabId: string, count: number) {
    this._tabsComponent?.updateTabUnreadCount(tabId, count);
  }

  public setSelectedTab(tabId: string) {
    this._tabsComponent?.setSelectedTab(tabId);
  }

  build(newElement: HTMLElement | undefined | null) {
    super.build(newElement);
    this.refreshTheme();
  }

  defaultElement(): HTMLElement {
    const feedOptions = this.getFeedOptions();

    this._titleComponent = new CourierInboxHeaderTitle(this._themeSubscription.manager, feedOptions[0]);
    this._filterMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, 'filters', true, feedOptions, () => {
      this._actionMenu?.closeMenu();
    });
    this._actionMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, 'actions', false, this.getActionOptions(), () => {
      this._filterMenu?.closeMenu();
    });

    // Selected default menu
    this._filterMenu.selectOption(feedOptions[0]);

    // Create unread badge
    this._unreadBadge = new CourierUnreadCountBadge({
      themeBus: this._themeSubscription.manager,
      location: 'header'
    });

    // Create title with filter menu section
    const titleSection = document.createElement('div');
    titleSection.className = 'title';
    titleSection.appendChild(this._titleComponent);
    titleSection.appendChild(this._filterMenu);
    titleSection.appendChild(this._unreadBadge);

    // Create flexible spacer
    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    // Create and setup actions section (just the action menu now)
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.appendChild(this._actionMenu);

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    headerContent.appendChild(titleSection);
    headerContent.appendChild(spacer);
    headerContent.appendChild(actions);

    // Create tabs component
    const activeFeed = this._feeds.find(feed => feed.id === this._activeFeedId);
    const hasMultipleTabs = (activeFeed?.tabs.length ?? 0) > 1;

    this._tabsComponent = new CourierInboxHeaderTabs({
      themeManager: this._themeSubscription.manager,
      onTabClick: (tabId: string) => {
        this._onTabChange(tabId);
      }
    });

    // Set the feed before building
    if (activeFeed) {
      this._tabsComponent.setFeed(activeFeed);
    }

    // Build the tabs component
    this._tabsComponent.build(undefined);

    // Set initial visibility based on tab count
    this._tabsComponent.setVisible(hasMultipleTabs);

    const header = document.createElement('div');
    header.className = 'header';
    header.appendChild(headerContent);
    header.appendChild(this._tabsComponent);

    return header;
  }

  setFeeds(feeds: CourierInboxFeed[]) {
    this._feeds = feeds;

    // If components are already built, we need to rebuild them with the new feeds
    if (this._filterMenu && this._titleComponent) {
      const feedOptions = this.getFeedOptions();

      // Recreate the filter menu with new options
      const oldFilterMenu = this._filterMenu;
      this._filterMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, 'filters', true, feedOptions, () => {
        this._actionMenu?.closeMenu();
      });

      // Find and replace the old filter menu in the DOM
      if (oldFilterMenu.parentNode) {
        oldFilterMenu.parentNode.replaceChild(this._filterMenu, oldFilterMenu);
      }

      // Update the title section with the new default option
      if (feedOptions.length > 0) {
        const selectedOption = feedOptions.find(opt => opt.id === this._activeFeedId) || feedOptions[0];
        this._titleComponent.updateSelectedOption(selectedOption, this._activeFeedId);
        this._filterMenu.selectOption(selectedOption);

        // Update badge visibility
        const activeFeed = this._feeds.find(feed => feed.id === this._activeFeedId);
        const hasMultipleTabs = (activeFeed?.tabs.length ?? 0) > 1;
        const unreadCount = hasMultipleTabs ? 0 : this._unreadCount;
        this._unreadBadge?.setCount(unreadCount);
      }
    }
  }

  static getStyles(theme: CourierInboxTheme): string {

    return `
      ${CourierInboxHeader.id} {
        display: flex;
      }

      ${CourierInboxHeader.id} > .header {
        display: flex;
        flex-direction: column;
        flex: 1;
        background-color: ${theme.inbox?.header?.backgroundColor ?? CourierColors.white[500]};
        box-shadow: ${theme.inbox?.header?.shadow ?? `0px 1px 0px 0px red`};
        z-index: 100;
      }

      ${CourierInboxHeader.id} .header-content {
        padding: 10px 10px 10px 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex: 1;
      }

      ${CourierInboxHeader.id} .title {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      ${CourierInboxHeader.id} .title courier-unread-count-badge {
        margin-left: 4px;
      }

      ${CourierInboxHeader.id} .spacer {
        flex: 1;
      }

      ${CourierInboxHeader.id} .actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `;

  }

}

registerElement(CourierInboxHeader);
