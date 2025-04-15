import { AuthenticationListener, Courier, InboxMessage, MessageEvent } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";

export class CourierInbox extends HTMLElement {
  private header: HTMLElement;
  private list: CourierInboxList;
  private authListener: AuthenticationListener | undefined;
  private onMessageClick?: (message: InboxMessage, index: number) => void;

  // Default props
  private defaultProps = {
    title: 'Inbox',
    icon: '',
    feedType: 'inbox' as const,
    height: '768px'
  };

  static get observedAttributes() {
    return ['title', 'icon', 'feed-type', 'height', 'message-click'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create header with default props
    this.header = document.createElement('courier-inbox-header');
    this.header.setAttribute('title', this.defaultProps.title);
    this.header.setAttribute('icon', this.defaultProps.icon);
    this.header.setAttribute('feed-type', this.defaultProps.feedType);

    // Create list and ensure it's properly initialized
    this.list = document.createElement('courier-inbox-list') as CourierInboxList;
    if (!(this.list instanceof CourierInboxList)) {
      throw new Error('Failed to create CourierInboxList instance');
    }

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
      const { feedType } = (event as CustomEvent).detail;
      this.list.setFeedType(feedType);
    });

    // Listen for message clicks from the list
    this.list.setOnMessageClick((message, index) => {
      if (this.onMessageClick) {
        this.onMessageClick(message, index);
      }
      // Dispatch a custom event when a message is clicked
      this.dispatchEvent(new CustomEvent('message-click', {
        detail: { message, index },
        bubbles: true,
        composed: true
      }));
    });

    this.authListener = Courier.shared.addAuthenticationListener((props) => {
      console.log('Authentication state changed in inbox.ts:', props);
      this.load();
    });
  }

  private async load() {
    try {
      await this.list.loadInbox(this.defaultProps.feedType);
      await this.connectSocket();
    } catch (error) {
      console.error('Failed to load inbox:', error);
      throw error;
    }
  }

  private async connectSocket() {
    const socket = Courier.shared.client?.inbox.socket;

    try {
      // If the socket is not available, return early
      if (!socket) {
        console.log('CourierInbox socket not available');
        return;
      }

      // If the socket is already connected, return early
      if (socket.isConnected) {
        console.log('CourierInbox socket already connected');
        return;
      }

      // Handle messages
      socket.receivedMessage = (message: InboxMessage) => this.list.addMessage(message);

      // Handle message events
      socket.receivedMessageEvent = (event: MessageEvent) => {
        console.log('CourierInboxList message event', event);
      };

      // Connect and subscribe to socket
      await socket.connect();
      await socket.sendSubscribe();
      socket.keepAlive();
      console.log('CourierInbox socket connected');
    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  }

  connectedCallback() {
    this.load();
  }

  disconnectedCallback() {
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