import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { CourierIconSource } from "@trycourier/courier-ui-core";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxDataStoreEvents } from "../datastore/datatore-events";
import { FeedType } from "../types/feed-type";
import { CourierInboxHeaderFactory } from "../types/factories";

export class CourierInbox extends HTMLElement implements CourierInboxDataStoreEvents {

  // State
  private _currentFeed: FeedType = 'inbox';

  // Components
  private _shadow: ShadowRoot;
  private _list: CourierInboxList;
  private _datastoreListener: CourierInboxDataStoreListener | undefined;
  private _authListener: AuthenticationListener | undefined;

  // Header
  private _header: CourierInboxHeader;
  private _headerFactory: CourierInboxHeaderFactory | undefined | null = undefined;

  // List
  private _onMessageClick?: (message: InboxMessage, index: number) => void;

  // Default props
  private defaultProps = {
    title: 'Inbox',
    icon: CourierIconSource.inbox,
    feedType: this._currentFeed,
    height: '768px'
  };

  static get observedAttributes() {
    return ['height', 'message-click'];
  }

  private get unreadCount() {
    return CourierInboxDatastore.shared.unreadCount;
  }

  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'open' });

    // Header
    this._header = new CourierInboxHeader({
      onFeedTypeChange: (feedType: FeedType) => {
        this.setFeedType(feedType);
      }
    });
    this._header.build(undefined);
    this._shadow.appendChild(this._header);

    // Create list and ensure it's properly initialized
    this._list = new CourierInboxList({
      onRefresh: () => {
        this.load({
          feedType: this._currentFeed,
          canUseCache: false
        });
      },
      onPaginationTrigger: async (feedType: FeedType) => {
        try {
          await CourierInboxDatastore.shared.fetchNextPageOfMessages({
            feedType: feedType
          });
        } catch (error) {
          console.error('Failed to fetch next page of messages:', error);
        }
      },
      onMessageClick: (message, index) => {
        CourierInboxDatastore.shared.clickMessage(message, index)

        this.dispatchEvent(new CustomEvent('message-click', {
          detail: { message, index },
          bubbles: true,
          composed: true
        }));

        this._onMessageClick?.(message, index);
      },
      onArchiveMessage: (message, index) => {
        CourierInboxDatastore.shared.archiveMessage(message, index);
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: ${this.defaultProps.height}px;
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
      this.load({ feedType: this._currentFeed, canUseCache: true });
    });
  }

  setHeader(factory: CourierInboxHeaderFactory | undefined | null) {
    console.log('Setting header', factory);
    this._headerFactory = factory;
    this.updateHeader();
  }

  setListItem(factory: (message: InboxMessage, index: number) => HTMLElement) {
    this._list.setListItemFactory(factory);
  }

  setPaginationItem(factory: (feedType: FeedType) => HTMLElement) {
    this._list.setPaginationItemFactory(factory);
  }

  setMessageClick(handler?: (message: InboxMessage, index: number) => void) {
    this._onMessageClick = handler;
  }

  setFeedType(feedType: FeedType) {

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
      unreadCount: this.unreadCount,
      messageCount: this._list.messages.length
    };

    console.log('Updating header', this._headerFactory);

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

  private async load(props: { feedType: FeedType, canUseCache: boolean }) {
    await CourierInboxDatastore.shared.load(props);
  }

  // Datastore event handlers
  public onDataSetChange(dataSet: InboxDataSet, feedType: FeedType): void {
    if (this._currentFeed === feedType) {
      this._list.setDataSet(dataSet);
      this.updateHeader();
    }
  }

  public onPageAdded(dataSet: InboxDataSet, feedType: FeedType): void {
    if (this._currentFeed === feedType) {
      this._list.addPage(dataSet);
      this.updateHeader();
    }
  }

  public onMessageAdd(message: InboxMessage, index: number, feedType: FeedType): void {
    if (this._currentFeed === feedType) {
      this._list.addMessage(message, index);
      this.updateHeader();
    }
  }

  public onMessageRemove(_: InboxMessage, index: number, feedType: FeedType): void {
    if (this._currentFeed === feedType) {
      this._list.removeMessage(index);
      this.updateHeader();
    }
  }

  public onMessageUpdate(message: InboxMessage, index: number, feedType: FeedType): void {
    if (this._currentFeed === feedType) {
      this._list.updateMessage(message, index);
      this.updateHeader();
    }
  }

  public onUnreadCountChange(_: number): void {
    this.updateHeader();
  }

  connectedCallback() {
    this.load({
      feedType: this._currentFeed,
      canUseCache: false
    });
  }

  disconnectedCallback() {
    this._datastoreListener?.remove();
    this._authListener?.remove();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    switch (name) {
      case 'height':
        const height = newValue || this.defaultProps.height;
        this.style.height = height;
        break;
      case 'message-click':
        if (newValue) {
          try {
            this._onMessageClick = new Function('message', 'index', newValue) as (message: InboxMessage, index: number) => void;
          } catch (error) {
            console.error('Failed to parse message-click handler:', error);
          }
        } else {
          this._onMessageClick = undefined;
        }
        break;
    }
  }
}

// Register the custom element
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}