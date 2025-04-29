import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { CourierIconSource, CourierSystemThemeElement, SystemThemeMode } from "@trycourier/courier-ui-core";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxDataStoreEvents } from "../datastore/datatore-events";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxTheme, defaultDarkTheme, defaultLightTheme } from "../types/courier-inbox-theme";

export class CourierInbox extends CourierSystemThemeElement implements CourierInboxDataStoreEvents {

  // State
  private _currentFeed: CourierInboxFeedType = 'inbox';

  // Themes
  private _lightTheme: CourierInboxTheme = defaultLightTheme;
  private _darkTheme: CourierInboxTheme = defaultDarkTheme;

  public set theme(value: CourierInboxTheme) {
    this._header.setTheme(value);
    this._list.setTheme(value);
  }

  // Components
  private _shadow: ShadowRoot;
  private _list: CourierInboxList;
  private _datastoreListener: CourierInboxDataStoreListener | undefined;
  private _authListener: AuthenticationListener | undefined;

  // Header
  private _header: CourierInboxHeader;
  private _headerFactory: ((props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) | undefined | null = undefined;

  // List
  private _onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;

  // Default props
  private _defaultProps = {
    title: 'Inbox',
    icon: CourierIconSource.inbox,
    feedType: this._currentFeed,
    height: '768px'
  };

  static get observedAttributes() {
    return ['height', 'message-click', 'light-theme', 'dark-theme'];
  }

  constructor() {
    super();

    // Attach the shadow DOM
    this._shadow = this.attachShadow({ mode: 'open' });

    // Header
    this._header = new CourierInboxHeader({
      theme: this.theme,
      onFeedTypeChange: (feedType: CourierInboxFeedType) => {
        this.setFeedType(feedType);
      }
    });
    this._header.build(undefined);
    this._shadow.appendChild(this._header);

    // Create list and ensure it's properly initialized
    this._list = new CourierInboxList({
      onRefresh: () => {
        this.refresh();
      },
      onPaginationTrigger: async (feedType: CourierInboxFeedType) => {
        try {
          await CourierInboxDatastore.shared.fetchNextPageOfMessages({
            feedType: feedType
          });
        } catch (error) {
          console.error('Failed to fetch next page of messages:', error);
        }
      },
      onMessageClick: (message, index) => {
        CourierInboxDatastore.shared.clickMessage(message);

        this.dispatchEvent(new CustomEvent('message-click', {
          detail: { message, index },
          bubbles: true,
          composed: true
        }));

        this._onMessageClick?.({ message, index });
      },
      onArchiveMessage: (message, _) => {
        CourierInboxDatastore.shared.archiveMessage(message);
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: ${this._defaultProps.height}px;
        overflow: hidden;
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

    this._shadow.appendChild(style);
    this._shadow.appendChild(this._list);

    // Attach the datastore listener
    this._datastoreListener = new CourierInboxDataStoreListener(this);
    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);

    // Listen for authentication state changes
    this._authListener = Courier.shared.addAuthenticationListener((_) => {
      this.refresh();
    });

    // Refresh the theme
    this.updateTheme(this.currentSystemTheme);

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

  public setMessageClick(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._onMessageClick = handler;
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
        this._header.refresh(props);
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
  }

  public refresh() {
    this.load({
      feedType: this._currentFeed,
      canUseCache: false
    });
  }

  // Datastore event handlers
  public onDataSetChange(dataSet: InboxDataSet, feedType: CourierInboxFeedType): void {
    if (this._currentFeed === feedType) {
      this._list.setDataSet(dataSet);
      this.updateHeader();
    }
  }

  public onPageAdded(dataSet: InboxDataSet, feedType: CourierInboxFeedType): void {
    if (this._currentFeed === feedType) {
      this._list.addPage(dataSet);
      this.updateHeader();
    }
  }

  public onMessageAdd(message: InboxMessage, index: number, feedType: CourierInboxFeedType): void {
    if (this._currentFeed === feedType) {
      this._list.addMessage(message, index);
      this.updateHeader();
    }
  }

  public onMessageRemove(_: InboxMessage, index: number, feedType: CourierInboxFeedType): void {
    if (this._currentFeed === feedType) {
      this._list.removeMessage(index);
      this.updateHeader();
    }
  }

  public onMessageUpdate(message: InboxMessage, index: number, feedType: CourierInboxFeedType): void {
    if (this._currentFeed === feedType) {
      this._list.updateMessage(message, index);
      this.updateHeader();
    }
  }

  public onUnreadCountChange(_: number): void {
    this.updateHeader();
  }

  connectedCallback() {
    this.refresh();
  }

  disconnectedCallback() {
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
            console.error('Failed to parse message-click handler:', error);
          }
        } else {
          this._onMessageClick = undefined;
        }
        break;
      case 'light-theme':
        if (newValue) {
          this._lightTheme = JSON.parse(newValue);
          if (this.currentSystemTheme === 'light') {
            this.updateTheme(this.currentSystemTheme);
          }
        }
        break;
      case 'dark-theme':
        if (newValue) {
          this._darkTheme = JSON.parse(newValue);
          if (this.currentSystemTheme === 'dark') {
            this.updateTheme(this.currentSystemTheme);
          }
        }
        break;
    }
  }

  protected onSystemThemeChange(theme: SystemThemeMode) {
    this.updateTheme(theme);
  }

  private updateTheme(theme: SystemThemeMode) {
    switch (theme) {
      case 'light':
        this.theme = this._lightTheme;
        break;
      case 'dark':
        this.theme = this._darkTheme;
        break;
    }
  }

}

// Register the custom element
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}