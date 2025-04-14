import { Courier, InboxMessage } from "@trycourier/courier-js";
import { FeedType } from "../types/feed-type";
import { CourierInfoState } from "@trycourier/courier-ui-core";
import { CourierLoadingState } from "@trycourier/courier-ui-core";
import { CourierListItem } from "./courier-inbox-list-item";

export class CourierInboxList extends HTMLElement {
  private list: HTMLUListElement;
  private messages: InboxMessage[] = [];
  private feedType: FeedType = 'inbox';
  private isLoading: boolean = true;
  private error: Error | null = null;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.list = document.createElement('ul');
    this.list.setAttribute('part', 'list');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        flex: 1;
        width: 100%;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.list);

    console.log('CourierInboxList constructor', Courier.shared.client);
  }

  async loadInbox(feedType: FeedType) {
    if (!Courier.shared.client) {
      this.setErrorNoClient();
      return;
    }

    try {
      this.setLoading(true);
      const response = feedType === 'inbox' ? await Courier.shared.client?.inbox.getMessages() : await Courier.shared.client?.inbox.getArchivedMessages();
      this.setMessages(response?.data?.messages?.nodes || []);
    } catch (error) {
      this.setError(error as Error);
    } finally {
      this.setLoading(false);
    }
  }

  setMessages(messages: InboxMessage[]) {
    this.messages = messages;
    this.error = null;
    this.isLoading = false;
    this.updateItems();
  }

  setFeedType(feedType: FeedType) {
    this.feedType = feedType;
    this.error = null;
    this.isLoading = true;
    this.messages = [];
    this.loadInbox(feedType);
  }

  setLoading(isLoading: boolean) {
    this.error = null;
    this.isLoading = isLoading;
    this.updateItems();
  }

  setError(error: Error | null) {
    console.log('CourierInboxList setError', error);
    this.error = error;
    this.isLoading = false;
    this.messages = [];
    this.updateItems();
  }

  setErrorNoClient() {
    this.setError(new Error('No user signed in'));
  }

  private getEmptyText(): string {
    return `No ${this.feedType} messages yet`;
  }

  private handleRetry() {
    console.log('CourierInboxList handleRetry');
    this.loadInbox(this.feedType);
  }

  private handleRefresh() {
    console.log('CourierInboxList handleRefresh');
    this.loadInbox(this.feedType);
  }

  private updateItems() {
    this.list.innerHTML = '';

    if (this.error) {
      const errorElement = new CourierInfoState();
      errorElement.setButtonText('Retry');
      errorElement.setButtonVariant('secondary');
      errorElement.setButtonSize('small');
      errorElement.setTitle(this.error.message);
      errorElement.setButtonClickCallback(() => this.handleRetry());
      this.list.appendChild(errorElement);
      return;
    }

    if (this.isLoading) {
      const loadingElement = new CourierLoadingState();
      this.list.appendChild(loadingElement);
      return;
    }

    if (this.messages.length === 0) {
      const emptyElement = new CourierInfoState();
      emptyElement.setButtonText('Refresh');
      emptyElement.setButtonVariant('secondary');
      emptyElement.setButtonSize('small');
      emptyElement.setTitle(this.getEmptyText());
      emptyElement.setButtonClickCallback(() => this.handleRefresh());
      this.list.appendChild(emptyElement);
      return;
    }

    this.messages.forEach((message) => {
      const listItem = new CourierListItem();
      listItem.setMessage(message);
      listItem.setFeedType(this.feedType);
      this.list.appendChild(listItem);
    });
  }
}

if (!customElements.get('courier-inbox-list')) {
  customElements.define('courier-inbox-list', CourierInboxList);
}
