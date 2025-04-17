import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";
import { CourierInboxHeader } from "./courier-inbox-header";
import { CourierIconSource } from "@trycourier/courier-ui-core";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxDataStoreEvents } from "../datastore/datatore-events";
import { FeedType } from "../types/feed-type";

export class CourierInbox extends HTMLElement implements CourierInboxDataStoreEvents {
  private header: CourierInboxHeader;
  private list: CourierInboxList;
  private datastoreListener: CourierInboxDataStoreListener | undefined;
  private authListener: AuthenticationListener | undefined;
  private onMessageClick?: (message: InboxMessage, index: number) => void;
  private currentFeed: FeedType = 'inbox';

  // Default props
  private defaultProps = {
    title: 'Inbox',
    icon: CourierIconSource.inbox,
    feedType: this.currentFeed,
    height: '768px'
  };

  static get observedAttributes() {
    return ['title', 'icon', 'feed-type', 'height', 'message-click'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create header with default props
    this.header = new CourierInboxHeader({
      onFeedTypeChange: (feedType: FeedType) => {
        this.currentFeed = feedType;
        this.list.setFeedType(feedType);
        this.refreshUnreadCount();
        this.load({
          feedType: this.currentFeed,
          canUseCache: true
        });
      }
    });
    this.header.setTitle(this.defaultProps.title);
    this.header.setIcon(this.defaultProps.icon);
    this.header.setFeedType(this.defaultProps.feedType, 0);
    this.refreshUnreadCount();

    // Create list and ensure it's properly initialized
    this.list = new CourierInboxList({
      onRefresh: () => {
        this.load({
          feedType: this.currentFeed,
          canUseCache: false
        });
      },
      onPaginationTrigger: async (feedType: FeedType) => {

        // Fetch the next page of messages for the given feed type
        // The event will propagate the data set change to the list
        // Pagination will not trigger if the feed is already paginating
        try {
          await CourierInboxDatastore.shared.fetchNextPageOfMessages({
            feedType: feedType
          });
        } catch (error) {
          console.error('Failed to fetch next page of messages:', error);
        }

      },
      onMessageClick: (message, index) => {

        // Click the message
        CourierInboxDatastore.shared.clickMessage(message, index)

        // Dispatch a custom event when a message is clicked
        this.dispatchEvent(new CustomEvent('message-click', {
          detail: { message, index },
          bubbles: true,
          composed: true
        }));

        // Call the onMessageClick callback if it exists
        this.onMessageClick?.(message, index);
      },
      onArchiveMessage: (message, index) => {

        // Archive the message
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

    shadow.appendChild(style);
    shadow.appendChild(this.header);
    shadow.appendChild(this.list);

    // Listen for feed type changes from the header
    this.header.addEventListener('feedTypeChange', (event: Event) => {
      console.log('Feed type changed in inbox.ts:', (event as CustomEvent).detail);
      const { feedType } = (event as CustomEvent).detail as { feedType: FeedType };
      this.currentFeed = feedType;
      this.list.setFeedType(feedType);
      this.load({
        feedType: this.currentFeed,
        canUseCache: true
      });
    });

    // Attach the datastore listener
    this.datastoreListener = new CourierInboxDataStoreListener(this);
    CourierInboxDatastore.shared.addDataStoreListener(this.datastoreListener);

    // Listen for authentication state changes
    this.authListener = Courier.shared.addAuthenticationListener((_) => {
      this.load({ feedType: this.currentFeed, canUseCache: true });
    });
  }

  private refreshUnreadCount() {
    this.header.setUnreadCount(CourierInboxDatastore.shared.unreadCount);
  }

  setMessageClick(handler?: (message: InboxMessage, index: number) => void) {
    this.onMessageClick = handler;
  }

  private async load(props: { feedType: FeedType, canUseCache: boolean }) {
    await CourierInboxDatastore.shared.load(props);
  }

  // Datastore event handlers
  public onDataSetChange(dataSet: InboxDataSet, feedType: FeedType): void {
    if (this.currentFeed === feedType) {
      this.list.setDataSet(dataSet);
      this.header.setFeedType(feedType, this.list.messages.length);
    }
  }

  public onPageAdded(dataSet: InboxDataSet, feedType: FeedType): void {
    if (this.currentFeed === feedType) {
      this.list.addPage(dataSet);
      this.header.setFeedType(feedType, this.list.messages.length);
    }
  }

  public onMessageAdd(message: InboxMessage, index: number, feedType: FeedType): void {
    if (this.currentFeed === feedType) {
      this.list.addMessage(message, index);
      this.header.setFeedType(feedType, this.list.messages.length);
    }
  }

  public onMessageRemove(_: InboxMessage, index: number, feedType: FeedType): void {
    if (this.currentFeed === feedType) {
      this.list.removeMessage(index);
      this.header.setFeedType(feedType, this.list.messages.length);
    }
  }

  public onMessageUpdate(message: InboxMessage, index: number, feedType: FeedType): void {
    if (this.currentFeed === feedType) {
      this.list.updateMessage(message, index);
      this.header.setFeedType(feedType, this.list.messages.length);
    }
  }

  public onUnreadCountChange(unreadCount: number): void {
    this.refreshUnreadCount();
  }

  // Load the inbox when the component is connected
  connectedCallback() {
    this.load({
      feedType: this.currentFeed,
      canUseCache: false
    });
  }

  // Remove the datastore listener and authentication listener
  disconnectedCallback() {
    this.datastoreListener?.remove();
    this.authListener?.remove();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'title':
        this.header.setAttribute('title', newValue || this.defaultProps.title);
        break;
      case 'icon':
        this.header.setAttribute('icon', newValue || this.defaultProps.icon);
        break;
      case 'feed-type':
        this.header.setAttribute('feed-type', newValue || this.defaultProps.feedType);
        this.list.setFeedType(newValue as any || this.defaultProps.feedType);
        break;
      case 'height':
        const height = newValue || this.defaultProps.height;
        this.style.height = height;
        break;
      case 'message-click':
        if (newValue) {
          try {
            this.onMessageClick = new Function('message', 'index', newValue) as (message: InboxMessage, index: number) => void;
          } catch (error) {
            console.error('Failed to parse message-click handler:', error);
          }
        } else {
          this.onMessageClick = undefined;
        }
        break;
    }
  }
}

// Register the custom element
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}