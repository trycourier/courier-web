import { CourierFactoryElement, registerElement, CourierColors, injectGlobalStyle, CourierIconButton, CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxFeedButton } from "./courier-inbox-feed-button";
import { CourierInboxHeaderFactoryProps } from "../types/factories";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeed, CourierInboxTab } from "../types/inbox-data-set";
import { CourierInboxTabs } from "./courier-inbox-tabs";
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
  private _currentFeedId?: string;

  // Components
  private _feedButton?: CourierInboxFeedButton;
  private _feedMenu?: CourierInboxOptionMenu;
  private _actionMenuButton?: CourierIconButton;
  private _actionMenu?: CourierInboxOptionMenu;
  public tabs?: CourierInboxTabs;
  private _style?: HTMLStyleElement;
  private _feedButtonClickHandler?: (event: Event) => void;

  // Callbacks
  private _onFeedChange: (feed: CourierInboxFeed) => void;
  private _onFeedReselected: (feed: CourierInboxFeed) => void;
  private _onTabChange: (tab: CourierInboxTab) => void;
  private _onTabReselected: (tab: CourierInboxTab) => void;

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: {
    themeManager: CourierInboxThemeManager,
    onFeedChange: (feed: CourierInboxFeed) => void,
    onFeedReselected: (feed: CourierInboxFeed) => void,
    onTabChange: (tab: CourierInboxTab) => void,
    onTabReselected: (tab: CourierInboxTab) => void
  }) {
    super();

    // Subscribe to the theme bus
    this._themeSubscription = props.themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Set the callbacks
    this._onFeedChange = props.onFeedChange;
    this._onFeedReselected = props.onFeedReselected;
    this._onTabChange = props.onTabChange;
    this._onTabReselected = props.onTabReselected;
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
    const actionMenu = theme.inbox?.header?.actions;
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

    this.refreshActionMenuButton();
    this._actionMenu?.setOptions(this.getActionOptions());
    this._feedMenu?.setOptions(this.getFeedMenuOptions());
  }

  private getFeedMenuOptions(): CourierInboxMenuOption[] {
    return this._feeds.map((feed, _index) => ({
      id: feed.id,
      text: feed.title,
      icon: {
        color: this.theme.inbox?.header?.feeds?.button?.selectedFeedIconColor ?? 'red',
        svg: feed.iconSVG ?? CourierIconSVGs.inbox
      },
      onClick: (_: CourierInboxMenuOption) => {
        if (feed.id === this._currentFeedId) {
          this._onFeedReselected(feed);
        } else {
          this._onFeedChange(feed);
        }
      }
    }));
  }

  public render(props: CourierInboxHeaderFactoryProps): void {
    if (this._feedButton) {
      this._feeds = props.feeds;
      this._feedButton.setFeeds(props.feeds);
      this._feedButton.setSelectedFeed(props.activeFeedId);
      this._feedButton.setUnreadCount(props.showTabs ? 0 : props.unreadCount);
      this.updateFeedButtonInteraction();
    }
    if (this.tabs) {
      this.tabs.style.display = props.showTabs ? 'flex' : 'none';
      this.tabs.setSelectedTab(props.activeTabId);
      this.tabs.updateTabUnreadCount(props.activeTabId, props.unreadCount);
    }
  }

  build(newElement: HTMLElement | undefined | null) {
    super.build(newElement);
    this.refreshTheme();
  }

  defaultElement(): HTMLElement {
    // Create feed button
    this._feedButton = new CourierInboxFeedButton(
      this._themeSubscription.manager,
      this._feeds
    );

    // Set the feed menu up
    this._feedMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, true, this.getFeedMenuOptions(), 'feed');
    this._feedMenu.setPosition({ left: '12px', top: '51px' });

    // Add click handler to feed button to toggle menu (only if multiple feeds)
    this._feedButtonClickHandler = (event: Event) => {
      event.stopPropagation();
      this._feedMenu?.toggleMenu();
      this._actionMenu?.closeMenu();
    };
    this.updateFeedButtonInteraction();

    // Action menu
    this._actionMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, false, this.getActionOptions(), 'action');
    this._actionMenu.setPosition({ right: '12px', top: '51px' }); // 51px just looks better

    // Action menu button
    this._actionMenuButton = new CourierIconButton(CourierIconSVGs.overflow);
    this.refreshActionMenuButton();
    this._actionMenuButton.addEventListener('click', (event: Event) => {
      event.stopPropagation();
      this._actionMenu?.toggleMenu();
      this._feedMenu?.closeMenu();
    });

    // Create title section with feed button
    const titleSection = document.createElement('div');
    titleSection.className = 'title';
    titleSection.appendChild(this._feedButton);

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
    headerContent.appendChild(this._feedMenu);

    this.tabs = new CourierInboxTabs({
      themeManager: this._themeSubscription.manager,
      onTabClick: (tab: CourierInboxTab) => {
        this._onTabChange(tab);
      },
      onTabReselected: (tab: CourierInboxTab) => {
        this._onTabReselected(tab);
      }
    });

    const header = document.createElement('div');
    header.className = 'header';
    header.appendChild(headerContent);
    header.appendChild(this.tabs);

    return header;
  }

  private refreshActionMenuButton() {
    const buttonConfig = this.theme?.inbox?.header?.actions?.button;
    this._actionMenuButton?.updateIconSVG(buttonConfig?.icon?.svg ?? CourierIconSVGs.overflow);
    this._actionMenuButton?.updateIconColor(buttonConfig?.icon?.color ?? 'red');
    this._actionMenuButton?.updateBackgroundColor(buttonConfig?.backgroundColor ?? 'transparent');
    this._actionMenuButton?.updateHoverBackgroundColor(buttonConfig?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._actionMenuButton?.updateActiveBackgroundColor(buttonConfig?.activeBackgroundColor ?? CourierColors.black[500_20]);
  }

  private updateFeedButtonInteraction() {
    if (!this._feedButton || !this._feedButtonClickHandler) {
      return;
    }

    // Always remove the listener first to avoid duplicates
    this._feedButton.removeEventListener('click', this._feedButtonClickHandler);

    const hasMultipleFeeds = this._feeds.length > 1;

    if (hasMultipleFeeds) {
      // Enable interaction: add click handler and set cursor to pointer
      this._feedButton.style.cursor = 'pointer';
      this._feedButton.addEventListener('click', this._feedButtonClickHandler);
    } else {
      // Disable interaction: remove click handler and set cursor to default
      this._feedButton.style.cursor = 'default';
    }
  }

  public setFeeds(feeds: CourierInboxFeed[]) {
    if (feeds.length === 0) {
      throw new Error('[CourierInboxHeader] Cannot set feeds to an empty array.');
    }

    if (!feeds[0].tabs.length) {
      throw new Error('[CourierInboxHeader] First feed does not have a tab.');
    }

    this._feeds = feeds;

    // Set the feeds and select the first feed
    this._feedButton?.setFeeds(feeds);
    this.selectFeed(feeds[0].id, feeds[0].tabs[0].id);

    // Set the feed menu options
    this._feedMenu?.setOptions(this.getFeedMenuOptions());

    // Update feed button interaction based on number of feeds
    this.updateFeedButtonInteraction();
  }

  public selectFeed(feedId: string, tabId: string) {
    // Set the selected feed
    this._currentFeedId = feedId;
    this._feedButton?.setSelectedFeed(feedId);
    const feedIndex = this._feeds.findIndex(feed => feed.id === feedId);
    this._feedMenu?.selectionItemAtIndex(feedIndex);

    // Set the selected tabs
    const tabs = this._feeds.find(feed => feed.id === feedId)?.tabs ?? [];
    if (tabs.length > 0 && this.tabs) {
      this.tabs.style.display = tabs.length > 1 ? 'flex' : 'none';
      this.tabs.setTabs(tabs);
      this.tabs.setSelectedTab(tabId);

      // Immediately update unread counts for all tabs from the datastore
      for (const tab of tabs) {
        const dataset = CourierInboxDatastore.shared.getDatasetById(tab.id);
        if (dataset) {
          this.tabs.updateTabUnreadCount(tab.id, dataset.unreadCount);
        }
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
        width: 100%;
        max-width: 100%;
        min-width: 0;
        position: relative;
        overflow-y: visible;
        background-color: ${theme.inbox?.header?.backgroundColor ?? CourierColors.white[500]};
        box-shadow: ${theme.inbox?.header?.shadow ?? `0px 1px 0px 0px red`};
        border-bottom: ${theme.inbox?.header?.border ?? '1px solid red'};
        z-index: 100;
      }

      ${CourierInboxHeader.id} .header-content {
        padding-top: 10px;
        padding-right: 12px;
        padding-bottom: 10px;
        padding-left: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        position: relative;
        box-sizing: border-box;
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
