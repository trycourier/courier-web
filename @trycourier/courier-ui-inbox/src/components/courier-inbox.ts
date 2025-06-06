import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { BaseElement, CourierComponentThemeMode, CourierIconSVGs, registerElement } from "@trycourier/courier-ui-core";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxTheme, defaultLightTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";

export class CourierInbox extends BaseElement {

  // State
  private _currentFeed: CourierInboxFeedType = 'inbox';

  // Theming
  private _themeManager: CourierInboxThemeManager;
  get theme() {
    return this._themeManager.getTheme();
  }

  public setLightTheme(theme: CourierInboxTheme) {
    this._themeManager.setLightTheme(theme);
  }

  public setDarkTheme(theme: CourierInboxTheme) {
    this._themeManager.setDarkTheme(theme);
  }

  // Components
  private _shadow: ShadowRoot;
  private _list: CourierInboxList;
  private _datastoreListener: CourierInboxDataStoreListener | undefined;
  private _authListener: AuthenticationListener | undefined;
  private _style: HTMLStyleElement;

  // Header
  private _header: CourierInboxHeader;
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
    height: '768px'
  };

  static get observedAttributes() {
    return ['height', 'light-theme', 'dark-theme', 'mode', 'message-click', 'message-action-click', 'message-long-press'];
  }

  constructor(themeManager?: CourierInboxThemeManager) {
    super();

    // Attach the shadow DOM
    this._shadow = this.attachShadow({ mode: 'open' });

    // Theme
    this._themeManager = themeManager ?? new CourierInboxThemeManager(defaultLightTheme);

    // Header
    this._header = new CourierInboxHeader({
      themeManager: this._themeManager,
      onFeedTypeChange: (feedType: CourierInboxFeedType) => {
        this.setFeedType(feedType);
      }
    });
    this._header.build(undefined);
    this._shadow.appendChild(this._header);

    // Create list and ensure it's properly initialized
    this._list = new CourierInboxList({
      themeManager: this._themeManager,
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

    this._style = document.createElement('style');
    this.refreshTheme();

    this._shadow.appendChild(this._style);
    this._shadow.appendChild(this._list);

    // Attach the datastore listener
    this._datastoreListener = new CourierInboxDataStoreListener({
      onError: (error: Error) => {
        this._list.setError(error);
      },
      onDataSetChange: (dataSet: InboxDataSet, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list.setDataSet(dataSet);
          this.updateHeader();
        }
      },
      onPageAdded: (dataSet: InboxDataSet, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list.addPage(dataSet);
          this.updateHeader();
        }
      },
      onMessageAdd: (message: InboxMessage, index: number, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list.addMessage(message, index);
          this.updateHeader();
        }
      },
      onMessageRemove: (_: InboxMessage, index: number, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list.removeMessage(index);
          this.updateHeader();
        }
      },
      onMessageUpdate: (message: InboxMessage, index: number, feedType: CourierInboxFeedType) => {
        if (this._currentFeed === feedType) {
          this._list.updateMessage(message, index);
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
    if (Courier.shared.client?.options.userId) {
      this.refresh();
    }

  }

  private refreshTheme() {
    this._style.textContent = this.getStyles();
  }

  private getStyles(): string {
    return `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: ${this._defaultProps.height};
      }

      courier-inbox-header {
        flex-shrink: 0;
      }

      courier-inbox-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
    `;
  }

  public setHeader(factory: (props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) {
    this._headerFactory = factory;
    this.updateHeader();
  }

  public removeHeader() {
    this._headerFactory = null;
    this.updateHeader();
  }

  public setLoadingState(factory: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement) {
    this._list.setLoadingStateFactory(factory);
  }

  public setEmptyState(factory: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement) {
    this._list.setEmptyStateFactory(factory);
  }

  public setErrorState(factory: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement) {
    this._list.setErrorStateFactory(factory);
  }

  public setListItem(factory: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement) {
    this._list.setListItemFactory(factory);
  }

  public setPaginationItem(factory: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement) {
    this._list.setPaginationItemFactory(factory);
  }

  public onMessageClick(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._onMessageClick = handler;
  }

  public onMessageActionClick(handler?: (props: CourierInboxListItemActionFactoryProps) => void) {
    this._onMessageActionClick = handler;
  }

  public onMessageLongPress(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._onMessageLongPress = handler;
  }

  public setFeedType(feedType: CourierInboxFeedType) {

    // Update state
    this._currentFeed = feedType;

    // Update components
    this._list.setFeedType(feedType);
    this.updateHeader();

    // Load data
    this.load({
      feedType: this._currentFeed,
      canUseCache: true
    });
  }

  private updateHeader() {

    const props = {
      feedType: this._currentFeed,
      unreadCount: CourierInboxDatastore.shared.unreadCount,
      messageCount: this._list.messages.length
    };

    switch (this._headerFactory) {
      case undefined:
        this._header.render(props);
        break;
      case null:
        this._header.build(null);
        break;
      default:
        const headerElement = this._headerFactory(props);
        this._header.build(headerElement);
        break;
    }

  }

  private async load(props: { feedType: CourierInboxFeedType, canUseCache: boolean }) {
    await CourierInboxDatastore.shared.load(props);
    await CourierInboxDatastore.shared.listenForUpdates();
  }

  public refresh() {
    this.load({
      feedType: this._currentFeed,
      canUseCache: false
    });
  }

  connectedCallback() {
    this.refresh();
  }

  disconnectedCallback() {
    this._themeManager.cleanup();
    this._datastoreListener?.remove();
    this._authListener?.remove();
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

// Register the custom element
registerElement('courier-inbox', CourierInbox);