import { AuthenticationListener, Courier } from "@trycourier/courier-js";
import { CourierInboxList } from "./courier-inbox-list";

export class CourierInbox extends HTMLElement {
  private header: HTMLElement;
  private list: CourierInboxList;
  private authListener: AuthenticationListener | undefined;
  private errorElement: HTMLElement | null = null;

  // Default props
  private defaultProps = {
    title: 'Inbox',
    icon: '',
    feedType: 'inbox' as const
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
    this.list.setFeedType(this.defaultProps.feedType);

    // Create error element using courier-info-state
    this.errorElement = document.createElement('courier-info-state');
    this.errorElement.setAttribute('part', 'error');
    this.errorElement.style.display = 'none';

    // Listen for feed type changes from the header
    this.header.addEventListener('feedTypeChange', (event: Event) => {
      console.log('Feed type changed in inbox.ts:', (event as CustomEvent).detail);
      const { feedType } = (event as CustomEvent).detail;
      this.list.setFeedType(feedType);
    });

    this.authListener = Courier.shared.addAuthenticationListener((props) => {
      console.log('Authentication state changed in inbox.ts:', props);
      this.showError(props.userId ? null : 'User not signed in');
      this.list.loadInbox(this.defaultProps.feedType);
    });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.header);
    shadow.appendChild(this.errorElement);
    shadow.appendChild(this.list);
  }

  private showError(message: string | null) {
    if (this.errorElement && message) {
      this.errorElement.setAttribute('title', message);
      this.errorElement.style.display = 'block';
      this.list.style.display = 'none';
    }
  }

  static get observedAttributes() {
    return ['title', 'icon', 'feed-type'];
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
    }
  }
}

// Register the custom element
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}