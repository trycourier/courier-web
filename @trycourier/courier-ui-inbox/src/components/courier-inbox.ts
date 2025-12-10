import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { CourierBaseElement, CourierComponentThemeMode, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxFeed, CourierInboxTab, InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxTheme, defaultLightTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";

export class CourierInbox extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox';
  }

  // State
  private _currentFeedId: string = CourierInbox.defaultFeeds()[0].id;
  private _feedTabMap: Map<string, string> = new Map();

  /** Returns the current feed type. */
  get currentFeedId(): string {
    return this._currentFeedId;
  }

  /** Returns the current tab ID for the current feed. */
  private get _currentTabId(): string {
    return this.getSelectedTabIdForFeed(this._currentFeedId);
  }

  /** Returns the selected tab ID for a given feed ID. */
  private getSelectedTabIdForFeed(feedId: string): string {
    return this._feedTabMap.get(feedId) ?? 'unknown_tab';
  }

  /** Returns the default feeds for the inbox. */
  public static defaultFeeds(): CourierInboxFeed[] {
    return [
      {
        id: 'inbox_feed',
        title: 'Inbox',
        iconSVG: CourierIconSVGs.inbox,
        tabs: [
          {
            id: 'all_messages',
            title: 'All Messages',
            filter: {}
          }
        ]
      },
      {
        id: 'archive_feed',
        title: 'Archive',
        iconSVG: CourierIconSVGs.archive,
        tabs: [
          {
            id: 'archived_messages',
            title: 'Archived Messages',
            filter: {
              archived: true
            }
          }
        ]
      }
    ];
  }

  /** Returns whether the tabs are currently visible based on the current feed having more than 1 tab. */
  get showTabs(): boolean {
    const currentFeed = this._feeds.find(feed => feed.id === this._currentFeedId);
    return (currentFeed?.tabs?.length ?? 0) > 1;
  }

  // Theming
  // Theme manager instance for handling theming logic
  private _themeManager: CourierInboxThemeManager;

  /** Returns the current theme object. */
  get theme() {
    return this._themeManager.getTheme();
  }

  /**
   * Set the light theme for the inbox.
   * @param theme The light theme object to set.
   */
  public setLightTheme(theme: CourierInboxTheme) {
    console.log('setLightTheme', theme);
    this._themeManager.setLightTheme(theme);
  }

  /**
   * Set the dark theme for the inbox.
   * @param theme The dark theme object to set.
   */
  public setDarkTheme(theme: CourierInboxTheme) {
    this._themeManager.setDarkTheme(theme);
  }

  /**
   * Set the theme mode (light/dark/system).
   * @param mode The theme mode to set.
   */
  public setMode(mode: CourierComponentThemeMode) {
    this._themeManager.setMode(mode);
  }


  // Components
  private _inboxStyle?: HTMLStyleElement;
  private _list?: CourierInboxList;
  private _datastoreListener: CourierInboxDataStoreListener | undefined;
  private _authListener: AuthenticationListener | undefined;
  private _feeds: CourierInboxFeed[] = CourierInbox.defaultFeeds();

  // Header
  private _header?: CourierInboxHeader;
  private _headerFactory: ((props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) | undefined | null = undefined;

  // List
  private _onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;
  private _onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;
  private _onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;

  // Default props
  private _defaultProps = {
    height: 'auto'
  };

  static get observedAttributes() {
    return ['height', 'light-theme', 'dark-theme', 'mode', 'message-click', 'message-action-click', 'message-long-press'];
  }

  constructor(themeManager?: CourierInboxThemeManager) {
    super();
    this._themeManager = themeManager ?? new CourierInboxThemeManager(defaultLightTheme);
  }

  private resetInitialFeedAndTab() {
    if (!this._feeds.length) {
      throw new Error('No feeds are available to initialize.');
    }

    // Clear the feed tab map
    this._feedTabMap.clear();

    // Set the default (first) tab for each feed in the map
    for (const feed of this._feeds) {
      if (!feed.tabs || !feed.tabs.length) {
        throw new Error(`Feed "${feed.id}" does not contain any tabs. You must have at least one tab in each feed.`);
      }
      // Set the default (first) tab for each feed in the map
      this._feedTabMap.set(feed.id, feed.tabs[0].id);
    }

    // Optionally set current feed and tab if not already set
    this._currentFeedId = this._feeds[0].id;
  }

  onComponentMounted() {
    this.readInitialThemeAttributes();
    this.attachElements();
    this.setupThemeSubscription();
    this.setupAuthListener();
    this.initializeInboxData();
  }

  private readInitialThemeAttributes() {
    const lightTheme = this.getAttribute('light-theme');
    if (lightTheme) {
      try {
        this.setLightTheme(JSON.parse(lightTheme));
      } catch (error) {
        Courier.shared.client?.options.logger?.error('Failed to parse light-theme attribute:', error);
      }
    }

    const darkTheme = this.getAttribute('dark-theme');
    if (darkTheme) {
      try {
        this.setDarkTheme(JSON.parse(darkTheme));
      } catch (error) {
        Courier.shared.client?.options.logger?.error('Failed to parse dark-theme attribute:', error);
      }
    }

    const mode = this.getAttribute('mode');
    if (mode) {
      this._themeManager.setMode(mode as CourierComponentThemeMode);
    }
  }

  private setupThemeSubscription() {

    // Subscribe to theme changes
    this._themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Refresh the theme
    this.refreshTheme();
  }

  private setupAuthListener() {
    this._authListener = Courier.shared.addAuthenticationListener(async ({ userId }) => {
      if (userId) {
        await this.refresh();
      }
    });
  }

  private initializeInboxData() {

    // Reset the initial feed and tab
    this.resetInitialFeedAndTab();

    // Create the datasets from the feeds
    CourierInboxDatastore.shared.createDatasetsFromFeeds(this._feeds);

    // Create the data store listener
    this._datastoreListener = new CourierInboxDataStoreListener({
      onError: (error: Error) => {
        this._list?.setError(error);
      },
      onDataSetChange: (dataSet: InboxDataSet, datasetId: string) => {
        if (this._currentTabId === datasetId) {
          this._list?.setDataSet(dataSet);
          this.updateHeader();
        }
      },
      onPageAdded: (dataSet: InboxDataSet, datasetId: string) => {
        if (this._currentTabId === datasetId) {
          this._list?.addPage(dataSet);
          this.updateHeader();
        }
      },
      onMessageAdd: (message: InboxMessage, index: number, datasetId: string) => {
        if (this._currentTabId === datasetId) {
          this._list?.addMessage(message, index);
          this.updateHeader();
        }
      },
      onMessageRemove: (_: InboxMessage, index: number, datasetId: string) => {
        if (this._currentTabId === datasetId) {
          this._list?.removeMessage(index);
          this.updateHeader();
        }
      },
      onMessageUpdate: (message: InboxMessage, index: number, datasetId: string) => {
        if (this._currentTabId === datasetId) {
          this._list?.updateMessage(message, index);
          this.updateHeader();
        }
      },
      onUnreadCountChange: (unreadCount: number, datasetId: string) => {
        // Always update the tab badges for all tabs
        this._header?.updateTabUnreadCount(datasetId, unreadCount);

        // TODO: Update the unread count for a specific tab and feed

        // Only update the main unread count if it's the current tab
        if (this._currentTabId === datasetId) {
          this.updateHeader();
        }
      }
    });

    // Add the data store listener to the datastore
    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);

    // Refresh the inbox
    this.refresh();
  }

  private attachElements() {

    // Inject style
    this._inboxStyle = injectGlobalStyle(CourierInbox.id, this.getStyles());

    // Header
    this._header = new CourierInboxHeader({
      themeManager: this._themeManager,
      onFeedChange: (feed: CourierInboxFeed) => {
        this.selectFeed(feed.id);
      },
      onTabChange: (tab: CourierInboxTab) => {
        this.selectTab(tab.id);
      },
      onTabReselected: (_tab: CourierInboxTab) => {
        this._list?.scrollToTop();
      }
    });

    // Build the element and set the initial feeds
    this._header?.build(undefined);
    this._header?.setFeeds(this._feeds);
    this.appendChild(this._header);

    // Create list and ensure it's properly initialized
    this._list = new CourierInboxList({
      themeManager: this._themeManager,
      canClickListItems: false,
      canLongPressListItems: false,
      onRefresh: () => {
        this.refresh();
      },
      onPaginationTrigger: async (feedType: string) => {
        try {
          await CourierInboxDatastore.shared.fetchNextPageOfMessages({
            datasetId: feedType
          });
        } catch (error) {
          Courier.shared.client?.options.logger?.error('Failed to fetch next page of messages:', error);
        }
      },
      onMessageClick: (message, index) => {
        CourierInboxDatastore.shared.clickMessage({ message });

        this.dispatchEvent(new CustomEvent('message-click', {
          detail: { message, index },
          bubbles: true,
          composed: true
        }));

        this._onMessageClick?.({ message, index });
      },
      onMessageActionClick: (message, action, index) => {

        // TODO: Track action click?

        this.dispatchEvent(new CustomEvent('message-action-click', {
          detail: { message, action, index },
          bubbles: true,
          composed: true
        }));

        this._onMessageActionClick?.({ message, action, index });
      },
      onMessageLongPress: (message, index) => {
        this.dispatchEvent(new CustomEvent('message-long-press', {
          detail: { message, index },
          bubbles: true,
          composed: true
        }));

        this._onMessageLongPress?.({ message, index });
      }
    });

    this.appendChild(this._list);

  }

  onComponentUnmounted() {
    this._themeManager.cleanup();
    this._datastoreListener?.remove();
    this._authListener?.remove();
    this._inboxStyle?.remove();
  }

  private refreshTheme() {
    this._list?.refreshInfoStateThemes();
    if (this._inboxStyle) {
      this._inboxStyle.textContent = this.getStyles();
    }
  }

  private getStyles(): string {
    return `
      ${CourierInbox.id} {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: ${this._defaultProps.height};
      }

      ${CourierInbox.id} courier-inbox-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
    `;
  }

  /**
   * Sets a custom header factory for the inbox.
   * @param factory - A function that returns an HTMLElement to render as the header.
   */
  public setHeader(factory: (props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) {
    this._headerFactory = factory;
    this.updateHeader();
  }

  /**
   * Removes the custom header factory from the inbox, reverting to the default header.
   */
  public removeHeader() {
    this._headerFactory = null;
    this.updateHeader();
  }

  /**
   * Sets a custom loading state factory for the inbox list.
   * @param factory - A function that returns an HTMLElement to render as the loading state.
   */
  public setLoadingState(factory: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement) {
    this._list?.setLoadingStateFactory(factory);
  }

  /**
   * Sets a custom empty state factory for the inbox list.
   * @param factory - A function that returns an HTMLElement to render as the empty state.
   */
  public setEmptyState(factory: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement) {
    this._list?.setEmptyStateFactory(factory);
  }

  /**
   * Sets a custom error state factory for the inbox list.
   * @param factory - A function that returns an HTMLElement to render as the error state.
   */
  public setErrorState(factory: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement) {
    this._list?.setErrorStateFactory(factory);
  }

  /**
   * Sets a custom list item factory for the inbox list.
   * @param factory - A function that returns an HTMLElement to render as a list item.
   */
  public setListItem(factory: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement) {
    this._list?.setListItemFactory(factory);
  }

  /**
   * Sets a custom pagination item factory for the inbox list.
   * @param factory - A function that returns an HTMLElement to render as a pagination item.
   */
  public setPaginationItem(factory: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement) {
    this._list?.setPaginationItemFactory(factory);
  }

  /**
   * Registers a handler for message click events.
   * @param handler - A function to be called when a message is clicked.
   */
  public onMessageClick(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._onMessageClick = handler;

    // Tell the list if we can click. This will update styles if needed.
    this._list?.setCanClickListItems(handler !== undefined);
  }

  /**
   * Registers a handler for message action click events.
   * @param handler - A function to be called when a message action is clicked.
   */
  public onMessageActionClick(handler?: (props: CourierInboxListItemActionFactoryProps) => void) {
    this._onMessageActionClick = handler;
  }

  /**
   * Registers a handler for message long press events.
   * @param handler - A function to be called when a message is long-pressed.
   */
  public onMessageLongPress(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._onMessageLongPress = handler;

    // Tell the list if we can long press. This will update styles if needed.
    this._list?.setCanLongPressListItems(handler !== undefined);
  }

  private async reloadListForTab() {
    this._list?.selectDataset(this._currentTabId);

    // Load data for the tab
    await CourierInboxDatastore.shared.load({
      canUseCache: true,
      datasetIds: [this._currentTabId]
    });

    // Scroll to top
    this._list?.scrollToTop(false);
  }

  /**
   * Sets the active feed for the inbox.
   * @param feedId - The feed ID to display.
   */
  public selectFeed(feedId: string) {
    // If reselecting the current feed, reset to first tab and reload
    if (this._currentFeedId === feedId) {
      const feed = this._feeds.find(f => f.id === feedId);
      if (feed && feed.tabs && feed.tabs.length > 0) {
        const firstTabId = feed.tabs[0].id;
        this._header?.selectFeed(feedId, firstTabId);
        this.selectTab(firstTabId);
      }
      return;
    }

    // Set the current feed and update the header
    this._currentFeedId = feedId;
    this._header?.selectFeed(feedId, this._currentTabId);
    this.selectTab(this._currentTabId);
  }

  /**
   * Switches to a tab by updating components and loading data.
   * @param tabId - The tab ID to switch to.
   */
  public selectTab(tabId: string) {

    // Save the selected tab for the current feed
    this._feedTabMap.set(this._currentFeedId, tabId);

    // Update components
    this._header?.setSelectedTab(tabId);
    this.reloadListForTab();
  }

  /**
   * Updates unread counts for a list of tabs.
   * @param tabs - The tabs to update unread counts for.
   */
  private updateTabUnreadCounts(tabs: CourierInboxTab[]) {
    for (const tab of tabs) {
      const dataset = CourierInboxDatastore.shared.getDatasetById(tab.id);
      if (dataset) {
        this._header?.updateTabUnreadCount(tab.id, dataset.unreadCount);
      }
    }
  }

  /**
   * Sets the feeds for the inbox.
   * @param feeds - The feeds to set for the inbox.
   */
  public setFeeds(feeds: CourierInboxFeed[]) {
    this._feeds = feeds;

    // Reset the initial feed and tab
    this.resetInitialFeedAndTab();

    // Create datasets from the feeds
    CourierInboxDatastore.shared.createDatasetsFromFeeds(this._feeds);

    // Update the header with new feeds
    this._header?.setFeeds(this._feeds);

    // Select the correct feed and tab before updating header to avoid tabs flashing
    this._header?.selectFeed(this._currentFeedId, this._currentTabId);

    // Update header (now with correct feed/tab selected)
    this.updateHeader();

    // Reload the list for the current tab
    this._list?.selectDataset(this._currentTabId);
    this._list?.scrollToTop(false);

    // Refresh the inbox data
    this.refresh();
  }

  /** Get the current set of feeds. */
  public getFeeds() {
    return this._feeds;
  }

  private updateHeader() {
    const tabId = this._currentTabId;
    if (!tabId) {
      return;
    }
    const unreadCount = CourierInboxDatastore.shared.getDatasetById(tabId)?.unreadCount ?? 0;
    const props: CourierInboxHeaderFactoryProps = {
      feeds: this._feeds,
      activeFeedId: this._currentFeedId,
      activeTabId: tabId,
      unreadCount: unreadCount,
      messageCount: this._list?.messages.length ?? 0,
      showTabs: this.showTabs,
    };

    switch (this._headerFactory) {
      case undefined:
        // Render default header
        this._header?.render(props);
        break;
      case null:
        // Remove header
        this._header?.build(null);
        break;
      default:
        // Render custom header
        const headerElement = this._headerFactory(props);
        this._header?.build(headerElement);
        break;
    }

  }

  private async load(props: { canUseCache: boolean }) {

    // Load the inbox data
    await CourierInboxDatastore.shared.load(props);

    // Update all tab unread counts immediately after loading data
    for (const feed of this._feeds) {
      this.updateTabUnreadCounts(feed.tabs);
    }

    // Connect to socket for realtime updates (don't wait for this)
    await CourierInboxDatastore.shared.listenForUpdates();
  }

  /**
   * Forces a reload of the inbox data, bypassing the cache.
   */
  public async refresh() {

    // Refresh the inbox if the user is already signed in
    if (!Courier.shared.client?.options.userId) {
      Courier.shared.client?.options.logger.error('No user signed in. Please call Courier.shared.signIn(...) to load the inbox.')
      return;
    }

    // Load the inbox data
    return this.load({
      canUseCache: false
    });

  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    switch (name) {
      case 'height':
        const height = newValue || this._defaultProps.height;
        this.style.height = height;
        break;
      case 'message-click':
        if (newValue) {
          try {
            this._onMessageClick = new Function('props', newValue) as (props: CourierInboxListItemFactoryProps) => void;
          } catch (error) {
            Courier.shared.client?.options.logger?.error('Failed to parse message-click handler:', error);
          }
        } else {
          this._onMessageClick = undefined;
        }
        break;
      case 'message-action-click':
        if (newValue) {
          try {
            this._onMessageActionClick = new Function('props', newValue) as (props: CourierInboxListItemActionFactoryProps) => void;
          } catch (error) {
            Courier.shared.client?.options.logger?.error('Failed to parse message-action-click handler:', error);
          }
        } else {
          this._onMessageActionClick = undefined;
        }
        break;
      case 'message-long-press':
        if (newValue) {
          try {
            this._onMessageLongPress = new Function('props', newValue) as (props: CourierInboxListItemFactoryProps) => void;
          } catch (error) {
            Courier.shared.client?.options.logger?.error('Failed to parse message-long-press handler:', error);
          }
        } else {
          this._onMessageLongPress = undefined;
        }
        break;
      case 'light-theme':
        if (newValue) {
          this.setLightTheme(JSON.parse(newValue));
        }
        break;
      case 'dark-theme':
        if (newValue) {
          this.setDarkTheme(JSON.parse(newValue));
        }
        break;
      case 'mode':
        this._themeManager.setMode(newValue as CourierComponentThemeMode);
        break;
    }
  }

}

registerElement(CourierInbox);
