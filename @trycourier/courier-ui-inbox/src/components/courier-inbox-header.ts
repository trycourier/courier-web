import { CourierFactoryElement, registerElement, CourierColors, injectGlobalStyle, CourierIconButton, CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxFeedButton } from "./courier-inbox-feed-button";
import { CourierInboxHeaderFactoryProps } from "../types/factories";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeed, CourierInboxTab } from "../types/inbox-data-set";
import { CourierInboxHeaderTabs } from "./courier-inbox-header-tabs";
import { CourierInboxMenuOption, CourierInboxOptionMenu } from "./courier-inbox-option-menu";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";

export class CourierInboxHeader extends CourierFactoryElement {

  static get id(): string {
    return 'courier-inbox-header';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _feeds: CourierInboxFeed[] = [];

  // Components
  private _titleComponent?: CourierInboxFeedButton;
  private _actionMenuButton?: CourierIconButton;
  private _actionMenu?: CourierInboxOptionMenu;
  private _feedMenu?: CourierInboxOptionMenu;
  private _tabsComponent?: CourierInboxHeaderTabs;
  private _style?: HTMLStyleElement;

  // Callbacks
  private _onFeedChange: (feed: CourierInboxFeed) => void;
  private _onTabChange: (tab: CourierInboxTab) => void;

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: {
    themeManager: CourierInboxThemeManager,
    onFeedChange: (feed: CourierInboxFeed) => void,
    onTabChange: (tab: CourierInboxTab) => void
  }) {
    super();

    // Subscribe to the theme bus
    this._themeSubscription = props.themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Set the callbacks
    this._onFeedChange = props.onFeedChange;
    this._onTabChange = props.onTabChange;
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxHeader.id, CourierInboxHeader.getStyles(this.theme));
  }

  onComponentUmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private getActionOptions(): CourierInboxMenuOption[] {
    const theme = this._themeSubscription.manager.getTheme();
    const actionMenu = theme.inbox?.header?.menus?.actions;
    return [
      {
        id: 'make_all_read',
        text: actionMenu?.markAllRead?.text ?? 'Mark All as Read',
        icon: {
          color: actionMenu?.markAllRead?.icon?.color ?? 'red',
          svg: actionMenu?.markAllRead?.icon?.svg ?? CourierIconSVGs.inbox
        },
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.readAllMessages();
        }
      },
      {
        id: 'archive_all',
        text: actionMenu?.archiveAll?.text ?? 'Archive All',
        icon: {
          color: actionMenu?.archiveAll?.icon?.color ?? 'red',
          svg: actionMenu?.archiveAll?.icon?.svg ?? CourierIconSVGs.archive
        },
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.archiveAllMessages();
        }
      },
      {
        id: 'archive_read',
        text: actionMenu?.archiveRead?.text ?? 'Archive Read',
        icon: {
          color: actionMenu?.archiveRead?.icon?.color ?? 'red',
          svg: actionMenu?.archiveRead?.icon?.svg ?? CourierIconSVGs.archive
        },
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

    this._actionMenu?.setOptions(this.getActionOptions());
    this._feedMenu?.setOptions(this.getFeedMenuOptions());
  }

  private getFeedMenuOptions(): CourierInboxMenuOption[] {
    return this._feeds.map((feed, index) => ({
      id: feed.id,
      text: feed.title,
      icon: {
        color: this.theme.inbox?.header?.feedButton?.currentFeedIconColor ?? 'red',
        svg: feed.iconSVG ?? CourierIconSVGs.inbox
      },
      onClick: (_: CourierInboxMenuOption) => {
        this._titleComponent?.setSelectedFeed(feed.id);
        this._feedMenu?.selectionItemAtIndex(index);
        this._onFeedChange(feed);
        // Update tabs when feed changes
        this._tabsComponent?.setFeed(feed);
      }
    }));
  }

  public render(props: CourierInboxHeaderFactoryProps): void {
    this._titleComponent?.setFeeds(props.feeds);
    this._titleComponent?.setSelectedFeed(props.activeFeedId);
    this._titleComponent?.showUnreadCountBadge(!props.showTabs);
    this._tabsComponent?.setSelectedTab(props.activeTabId);
    this._tabsComponent?.updateTabUnreadCount(props.activeTabId, props.unreadCount);
  }

  public setFeedButtonUnreadCount(count: number, show: boolean) {
    this._titleComponent?.setUnreadCount(count);
    this._titleComponent?.showUnreadCountBadge(show);
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
    // Create feed button
    this._titleComponent = new CourierInboxFeedButton(
      this._themeSubscription.manager,
      this._feeds
    );
    this._titleComponent.setSelectedFeed(this._feeds[0].id);

    // Feed menu (only if there are multiple feeds)
    if (this._feeds.length > 1) {
      this._feedMenu = new CourierInboxOptionMenu(
        this._themeSubscription.manager,
        true, // selectable
        this.getFeedMenuOptions()
      );
      this._feedMenu.setPosition({ left: '12px', top: '51px' });

      // Add click handler to feed button to toggle menu
      this._titleComponent.style.cursor = 'pointer';
      this._titleComponent.addEventListener('click', (event: Event) => {
        event.stopPropagation();
        this._feedMenu?.toggleMenu();
      });
    }

    // Action menu
    this._actionMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, false, this.getActionOptions());
    this._actionMenu.setPosition({ right: '12px', top: '51px' }); // 51px just looks better

    // Action menu button
    this._actionMenuButton = new CourierIconButton(CourierIconSVGs.overflow);
    const buttonConfig = this.theme?.inbox?.header?.menus?.actions?.button;
    this._actionMenuButton?.updateIconSVG(buttonConfig?.icon?.svg ?? CourierIconSVGs.overflow);
    this._actionMenuButton?.updateIconColor(buttonConfig?.icon?.color ?? 'red');
    this._actionMenuButton?.updateBackgroundColor(buttonConfig?.backgroundColor ?? 'transparent');
    this._actionMenuButton?.updateHoverBackgroundColor(buttonConfig?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._actionMenuButton?.updateActiveBackgroundColor(buttonConfig?.activeBackgroundColor ?? CourierColors.black[500_20]);
    this._actionMenuButton.addEventListener('click', (event: Event) => {
      event.stopPropagation();
      this._actionMenu?.toggleMenu();
    });

    // Create title section with feed button
    const titleSection = document.createElement('div');
    titleSection.className = 'title';
    titleSection.appendChild(this._titleComponent);

    // Create flexible spacer
    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    headerContent.appendChild(titleSection);
    headerContent.appendChild(spacer);

    // Add action menu button and menu
    headerContent.appendChild(this._actionMenuButton);
    headerContent.appendChild(this._actionMenu);

    // Add feed menu if it exists (for multiple feeds)
    if (this._feedMenu) {
      headerContent.appendChild(this._feedMenu);
    }

    // Create tabs component
    const activeFeed = this._titleComponent?.selectedFeed;

    this._tabsComponent = new CourierInboxHeaderTabs({
      themeManager: this._themeSubscription.manager,
      onTabClick: (tab: CourierInboxTab) => {
        this._onTabChange(tab);
      }
    });

    // Set the feed before building
    if (activeFeed) {
      this._tabsComponent.setFeed(activeFeed);
    }

    // Build the tabs component
    this._tabsComponent.build(undefined);

    const header = document.createElement('div');
    header.className = 'header';
    header.appendChild(headerContent);
    header.appendChild(this._tabsComponent);

    return header;
  }

  public setFeeds(feeds: CourierInboxFeed[]) {
    if (feeds.length === 0) {
      throw new Error('[CourierInboxHeader] Cannot set feeds to an empty array.');
    }
    this._feeds = feeds;
    this._titleComponent?.setFeeds(feeds);
    this._titleComponent?.setSelectedFeed(feeds[0].id);
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
        padding-top: 10px;
        padding-right: 8px;
        padding-bottom: 10px;
        padding-left: 12px;
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
