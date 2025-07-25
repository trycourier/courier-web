import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { CourierBaseElement, CourierComponentThemeMode, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
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
  private _currentFeed: CourierInboxFeedType = 'inbox';

  /** Returns the current feed type. */
  get currentFeed(): CourierInboxFeedType {
    return this._currentFeed;
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
      onFeedTypeChange: (feedType: CourierInboxFeedType) => {
        this.setFeedType(feedType);
      }
    });
    this._header.build(undefined);
    this.appendChild(this._header);

    // Create list and ensure it's properly initialized
    this._list = new CourierInboxList({
      themeManager: this._themeManager,
      canClickListItems: false,
      canLongPressListItems: false,
      onRefresh: () => {
        this.refresh();
      },
      onPaginationTrigger: async (feedType: CourierInboxFeedType) => {
        try {
          await CourierInboxDatastore.shared.fetchNextPageOfMessages({
            feedType: feedType
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

    // Attach the datastore listener
    this._datastoreListener = new CourierInboxDataStoreListener({
      onError: (error: Error) => {
        this._list?.setError(error);
      },
      onDataSetChange: (dataSet: InboxDataSet, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list?.setDataSet(dataSet);
          this.updateHeader();
        }
      },
      onPageAdded: (dataSet: InboxDataSet, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list?.addPage(dataSet);
          this.updateHeader();
        }
      },
      onMessageAdd: (message: InboxMessage, index: number, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list?.addMessage(message, index);
          this.updateHeader();
        }
      },
      onMessageRemove: (_: InboxMessage, index: number, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list?.removeMessage(index);
          this.updateHeader();
        }
      },
      onMessageUpdate: (message: InboxMessage, index: number, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list?.updateMessage(message, index);
          this.updateHeader();
        }
      },
      onUnreadCountChange: (_: number) => {
        this.updateHeader();
      }
    });

    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);

    // Refresh the theme on change
    this._themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Listen for authentication state changes
    this._authListener = Courier.shared.addAuthenticationListener((_) => {
      this.refresh();
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
  public setFeedType(feedType: CourierInboxFeedType) {

    // Do not swap if current feed is same
    if (this._currentFeed === feedType) {
      return;
    }

    // Update state
    this._currentFeed = feedType;

    // Update components
    this._list?.setFeedType(feedType);
    this.updateHeader();

    // Load data
    this.load({
      canUseCache: true
    });
  }

  private updateHeader() {

    const props = {
      feedType: this._currentFeed,
      unreadCount: CourierInboxDatastore.shared.unreadCount,
      messageCount: this._list?.messages.length ?? 0
    };

    switch (this._headerFactory) {
      case undefined:
        this._header?.render(props);
        break;
      case null:
        this._header?.build(null);
        break;
      default:
        const headerElement = this._headerFactory(props);
        this._header?.build(headerElement);
        break;
    }

  }

  private async load(props: { canUseCache: boolean }) {
    await CourierInboxDatastore.shared.load(props);
    await CourierInboxDatastore.shared.listenForUpdates();
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