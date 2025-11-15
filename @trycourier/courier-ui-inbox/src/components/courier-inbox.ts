import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { CourierBaseElement, CourierComponentThemeMode, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxFeed, CourierInboxTab, InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxTheme, defaultLightTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInbox extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox';
  }

  // State
  private _currentFeed: string = 'inbox';
  private _currentTabId: string = 'inbox-tab';

  /** Returns the current feed type. */
  get currentFeed(): CourierInboxFeedType | string {
    return this._currentFeed;
  }

  get currentTab(): string {
    return this._currentTabId;
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
  private _unreadIndicatorStyle?: HTMLStyleElement;
  private _list?: CourierInboxList;
  private _datastoreListener: CourierInboxDataStoreListener | undefined;
  private _authListener: AuthenticationListener | undefined;
  private _unreadCount: number = 0;
  private _feeds: CourierInboxFeed[] = CourierInbox.createDefaultFeeds();

  // Header
  private _header?: CourierInboxHeader;
  private _headerFactory: ((props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) | undefined | null = undefined;

  // List
  private _onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;
  private _onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;
  private _onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;

  // Default props
  private _defaultProps = {
    title: 'Inbox',
    icon: CourierIconSVGs.inbox,
    feedType: this._currentFeed,
    height: 'auto'
  };

  static get observedAttributes() {
    return ['height', 'light-theme', 'dark-theme', 'mode', 'message-click', 'message-action-click', 'message-long-press'];
  }

  constructor(themeManager?: CourierInboxThemeManager) {
    super();
    this._themeManager = themeManager ?? new CourierInboxThemeManager(defaultLightTheme);
  }

  onComponentMounted() {

    // Inject style
    this._inboxStyle = injectGlobalStyle(CourierInbox.id, this.getStyles());
    this._unreadIndicatorStyle = injectGlobalStyle(CourierUnreadCountBadge.id, CourierUnreadCountBadge.getStyles(this.theme));

    // Header
    this._header = new CourierInboxHeader({
      themeManager: this._themeManager,
      onFeedTypeChange: (feedType: CourierInboxFeedType | string) => {
        this.setFeedType(feedType);
      },
      onTabChange: (tabId: string) => {
        this.setActiveTab(tabId);
      }
    });
    this._header.setFeeds(this._feeds);
    this._header.build(undefined);
    this._header.setSelectedTab(this._currentTabId);
    this.appendChild(this._header);

    // Initial render to set correct unread badge visibility
    this.updateHeader();

    // Create list and ensure it's properly initialized
    this._list = new CourierInboxList({
      themeManager: this._themeManager,
      canClickListItems: false,
      canLongPressListItems: false,
      onRefresh: () => {
        this.refresh();
      },
      onPaginationTrigger: async (feedType: CourierInboxFeedType | string) => {
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

    this.refreshTheme();

    this.appendChild(this._list);

    CourierInboxDatastore.shared.createDatasetsFromFeeds(this._feeds);

    // Load unread counts for all tabs immediately (single GraphQL query)
    const allTabIds = this._feeds.flatMap(feed => feed.tabs.map(tab => tab.id));
    CourierInboxDatastore.shared.loadUnreadCountsForTabs(allTabIds);

    // Attach the datastore listener
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

        // Only update the main unread count if it's the current tab
        if (this._currentTabId === datasetId) {
          this._unreadCount = unreadCount;
          this.updateHeader();
        }
      }
    });

    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);

    // Initialize unread counts for all tabs
    this.initializeTabUnreadCounts();

    // Refresh the theme on change
    this._themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Listen for authentication state changes
    this._authListener = Courier.shared.addAuthenticationListener(async ({ userId }) => {
      if (userId) {
        await this.refresh();
      }
    });

    // Refresh the inbox if the user is already signed in
    if (!Courier.shared.client?.options.userId) {
      Courier.shared.client?.options.logger.error('No user signed in. Please call Courier.shared.signIn(...) to load the inbox.')
      return;
    }

    this.refresh();

  }

  onComponentUnmounted() {
    this._themeManager.cleanup();
    this._datastoreListener?.remove();
    this._authListener?.remove();
    this._inboxStyle?.remove();
    this._unreadIndicatorStyle?.remove();
  }

  private refreshTheme() {
    this._list?.refreshInfoStateThemes();
    if (this._inboxStyle) {
      this._inboxStyle.textContent = this.getStyles();
    }
    if (this._unreadIndicatorStyle) {
      this._unreadIndicatorStyle.textContent = CourierUnreadCountBadge.getStyles(this.theme);
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

  /**
   * Sets the feed type for the inbox (e.g., "inbox" or "archive").
   * @param feedType - The feed type to display.
   */
  public setFeedType(feedType: CourierInboxFeedType | string) {
    // Do not swap if current feed is same
    if (this._currentFeed === feedType) {
      return;
    }

    // Update state
    this._currentFeed = feedType;

    // Update to the first tab of the new feed
    const newFeed = this._feeds.find(feed => feed.id === feedType);
    if (newFeed && newFeed.tabs.length > 0) {
      this._currentTabId = newFeed.tabs[0].id;
    }

    // Switch to the new tab and update unread counts for all tabs in the feed
    this.switchToTab(this._currentTabId);

    // Update unread counts for all tabs in the new feed
    if (newFeed) {
      this.updateTabUnreadCounts(newFeed.tabs);
    }
  }

  /**
   * Sets the active tab for the current feed.
   * @param tabId - The tab ID to display.
   */
  public setActiveTab(tabId: string) {
    // Do not swap if current tab is same
    if (this._currentTabId === tabId) {
      return;
    }

    // Update state
    this._currentTabId = tabId;

    // Switch to the new tab
    this.switchToTab(tabId);
  }

  /**
   * Switches to a tab by updating components and loading data.
   * @param tabId - The tab ID to switch to.
   */
  private switchToTab(tabId: string) {
    // Update the unread count from the dataset immediately
    const dataset = CourierInboxDatastore.shared.getDatasetById(tabId);
    if (dataset) {
      this._unreadCount = dataset.unreadCount;
    }

    // Update components
    this._list?.setFeedType(tabId);
    this._header?.setSelectedTab(tabId);
    this.updateHeader();

    // Load data for the tab (will use cache if available)
    CourierInboxDatastore.shared.load({
      canUseCache: true,
      datasetIds: [tabId]
    });
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
   * Set the feeds for this Inbox, replacing any existing feeds.
   *
   * By default, feeds are set to:
   *
   * ```
   * [
   *   {
   *     label: 'Inbox',
   *     tabs: [{ label: 'Inbox', id: 'inbox', filter: {}}],
   *   },
   *   {
   *     label: 'Archive',
   *     tabs: [{ label: 'Archive', id: 'archive', filter: { archived: true }}],
   *   }
   * ]
   * ```
   *
   * @param feeds the list of feeds to set for the Inbox
   * @throws if feeds includes a duplicate feed or tab ID
   */
  public setFeeds(feeds: CourierInboxFeed[]) {
    const feedIds: string[] = [];
    const tabIds: string[] = [];

    // Validate feeds and tabs have unique IDs
    for (let feed of feeds) {
      if (feedIds.includes(feed.id)) {
        throw new Error(`[CourierInbox] Duplicate feed ID [${feed.id}] passed to setFeeds.`);
      }

      feedIds.push(feed.id);

      for (let tab of feed.tabs) {
        if (tabIds.includes(tab.id)) {
          throw new Error(`[CourierInbox] Duplicate tab ID [${tab.id}] passed to setFeeds.`);
        }

        tabIds.push(tab.id);
      }
    }

    this._feeds = feeds;

    // Select the first feed and tab if it exists
    if (this._feeds.length > 0 && this._feeds[0].tabs.length > 0) {
      this._currentFeed = feeds[0].id;
      this._currentTabId = feeds[0].tabs[0].id;
    }

    // If the component is already mounted, we need to update everything
    if (this._header && this._list) {
      // Create datasets for the new feeds and load unread counts
      CourierInboxDatastore.shared.createDatasetsFromFeeds(this._feeds);
      CourierInboxDatastore.shared.loadUnreadCountsForTabs(tabIds);

      // Update the list and header to show the current tab
      this._list.setFeedType(this._currentTabId);
      this._header.setFeeds(this._feeds);
      this._header.setSelectedTab(this._currentTabId);
      this.updateHeader();

      // Load messages for the current tab
      CourierInboxDatastore.shared.load({
        canUseCache: true,
        datasetIds: [this._currentTabId]
      });
    }
    // If not mounted yet, just update the feeds - onComponentMounted will handle the rest
  }

  /** Get the current set of feeds. */
  public getFeeds() {
    return this._feeds;
  }

  private updateHeader() {
    // Find the feed that contains the current tab
    const currentFeed = this._feeds.find(feed =>
      feed.tabs.some(tab => tab.id === this._currentTabId)
    );
    const feedType = currentFeed?.id ?? this._currentFeed;

    const props = {
      feedType: feedType,
      unreadCount: this._unreadCount,
      messageCount: this._list?.messages.length ?? 0,
    };

    switch (this._headerFactory) {
      case undefined:
        // Render default header
        this._header?.setFeeds(this._feeds);
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
    await CourierInboxDatastore.shared.load(props);

    // Update all tab unread counts immediately after loading data
    this.initializeTabUnreadCounts();

    // Connect to socket for realtime updates (don't wait for this)
    await CourierInboxDatastore.shared.listenForUpdates();
  }

  private initializeTabUnreadCounts() {
    // Initialize unread counts for all tabs from the datastore
    for (const feed of this._feeds) {
      this.updateTabUnreadCounts(feed.tabs);
    }
  }

  private static createDefaultFeeds(): CourierInboxFeed[] {
    return [
      {
        id: 'inbox',
        label: 'Inbox',
        tabs: [{ id: 'inbox-tab', label: 'Inbox', filter: {}}]
      },
      {
        id: 'archive',
        label: 'Archive',
        tabs: [{ id: 'archive-tab', label: 'Archive', filter: { archived: true }}]
      }
    ];
  }

  /**
   * Forces a reload of the inbox data, bypassing the cache.
   */
  public refresh() {
    this.load({
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
