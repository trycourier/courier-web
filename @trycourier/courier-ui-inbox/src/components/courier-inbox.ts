import { AuthenticationListener, Courier } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";

export class CourierInbox extends HTMLElement {
  private header: HTMLElement;
  private list: CourierInboxList;
  private authListener: AuthenticationListener | undefined;

  // Default props
  private defaultProps = {
    title: 'Inbox',
    icon: '',
    feedType: 'inbox' as const,
    minHeight: '768'
  };

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
        min-height: ${this.defaultProps.minHeight}px;
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

    this.authListener = Courier.shared.addAuthenticationListener((props) => {
      console.log('Authentication state changed in inbox.ts:', props);
      this.list.loadInbox(this.defaultProps.feedType);
    });

  }

  static get observedAttributes() {
    return ['title', 'icon', 'feed-type', 'min-height'];
  }

  connectedCallback() {
    console.log('CourierInbox connected');
    console.log('CourierInbox client', Courier.shared.client);
    this.list.loadInbox(this.defaultProps.feedType);
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
      case 'min-height':
        const minHeight = newValue || this.defaultProps.minHeight;
        this.style.minHeight = `${minHeight}px`;
        break;
    }
  }
}

// Register the custom element
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}