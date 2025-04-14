import { Courier, InboxMessage } from "@trycourier/courier-js";
import { FeedType } from "../types/feed-type";
import { CourierInfoState } from "@trycourier/courier-ui-core";
import { CourierLoadingState } from "@trycourier/courier-ui-core";

export class CourierInboxList extends HTMLElement {
  private list: HTMLUListElement;
  private messages: InboxMessage[] = [];
  private feedType: FeedType = 'inbox';
  private isLoading: boolean = true;
  private error: Error | null = null;
  private hasLoaded: boolean = false;

  // Default props
  private defaultProps = {
    loadingText: 'Loading messages...',
    errorText: 'Error loading messages'
  };

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.list = document.createElement('ul');
    this.list.setAttribute('part', 'list');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.list);
  }

  async loadInbox(feedType: FeedType) {
    try {
      this.setLoading(true);
      const response = feedType === 'inbox' ? await Courier.shared.client?.inbox.getMessages() : await Courier.shared.client?.inbox.getArchivedMessages();
      this.setMessages(response?.data?.messages?.nodes || []);
      this.hasLoaded = true;
    } catch (error) {
      this.setError(error as Error);
      this.hasLoaded = true;
    } finally {
      this.setLoading(false);
    }
  }

  setMessages(messages: InboxMessage[]) {
    this.messages = messages;
    this.updateItems();
  }

  setFeedType(feedType: FeedType) {
    this.feedType = feedType;
    this.loadInbox(feedType);
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.updateItems();
  }

  setError(error: Error | null) {
    this.error = error;
    this.updateItems();
  }

  private getEmptyText(): string {
    return `No ${this.feedType} messages yet`;
  }

  private updateItems() {
    if (!this.list) {
      console.error('List element not initialized');
      return;
    }

    this.list.innerHTML = '';

    if (this.isLoading) {
      const loadingElement = new CourierLoadingState();
      this.list.appendChild(loadingElement);
      return;
    }

    if (this.error) {
      const errorElement = new CourierInfoState();
      errorElement.setAttribute('title', this.defaultProps.errorText);
      errorElement.setAttribute('button-text', 'Retry');
      errorElement.setAttribute('button-action', 'retry');
      this.list.appendChild(errorElement);
      return;
    }

    if (this.hasLoaded && this.messages.length === 0) {
      const emptyElement = new CourierInfoState();
      emptyElement.setAttribute('title', this.getEmptyText());
      emptyElement.setAttribute('button-text', 'Refresh');
      emptyElement.setAttribute('button-action', 'refresh');
      this.list.appendChild(emptyElement);
      return;
    }

    this.messages.forEach((message) => {
      if (!message) {
        console.warn('Skipping invalid message');
        return;
      }
      const listItem = document.createElement('courier-list-item');
      listItem.setAttribute('message', JSON.stringify(message));
      listItem.setAttribute('feed-type', this.feedType);
      this.list.appendChild(listItem);
    });
  }
}

if (!customElements.get('courier-inbox-list')) {
  customElements.define('courier-inbox-list', CourierInboxList);
}
