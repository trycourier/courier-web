import { Courier, InboxMessage } from "@trycourier/courier-js";
import { FeedType } from "../types/feed-type";
import { CourierInfoState, CourierLoadingState } from "@trycourier/courier-ui-core";
import { CourierListItem } from "./courier-inbox-list-item";

export class CourierInboxList extends HTMLElement {
  private readonly list: HTMLUListElement;
  private messages: InboxMessage[] = [];
  private feedType: FeedType = 'inbox';
  private isLoading = true;
  private error: Error | null = null;
  private onMessageClick: ((message: InboxMessage, index: number) => void) | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.list = document.createElement('ul');
    this.list.setAttribute('part', 'list');

    const style = document.createElement('style');
    style.textContent = this.getStyles();

    shadow.appendChild(style);
    shadow.appendChild(this.list);
  }

  private getStyles(): string {
    return `
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
  }

  async loadInbox(feedType: FeedType): Promise<void> {

    // Do not fetch if we cannot connect to the client
    if (!Courier.shared.client) {
      this.setErrorNoClient();
      return;
    }

    try {
      this.setLoading(true);
      const response = feedType === 'inbox'
        ? await Courier.shared.client?.inbox.getMessages()
        : await Courier.shared.client?.inbox.getArchivedMessages();
      this.setMessages(response?.data?.messages?.nodes || []);
    } catch (error) {
      this.setError(error as Error);
    } finally {
      this.setLoading(false);
    }
  }

  public addMessage(message: InboxMessage, index = 0): void {
    this.messages.splice(index, 0, message);
    this.updateItems();
  }

  public setMessages(messages: InboxMessage[]): void {
    this.messages = messages;
    this.error = null;
    this.isLoading = false;
    this.updateItems();
  }

  public setFeedType(feedType: FeedType): void {
    this.feedType = feedType;
    this.error = null;
    this.isLoading = true;
    this.loadInbox(feedType);
  }

  public setLoading(isLoading: boolean): void {
    this.error = null;
    this.isLoading = isLoading;
    this.updateItems();
  }

  public setError(error: Error | null): void {
    this.error = error;
    this.isLoading = false;
    this.messages = [];
    this.updateItems();
  }

  public setErrorNoClient(): void {
    this.setError(new Error('No user signed in'));
  }

  private getEmptyText(): string {
    return `No ${this.feedType} messages yet`;
  }

  private handleRetry(): void {
    this.loadInbox(this.feedType);
  }

  private handleRefresh(): void {
    this.loadInbox(this.feedType);
  }

  public setOnMessageClick(callback: (message: InboxMessage, index: number) => void): void {
    this.onMessageClick = callback;
  }

  private updateItems(): void {
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
      this.list.appendChild(new CourierLoadingState());
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

    this.messages.forEach((message, index) => {
      const listItem = new CourierListItem();
      listItem.setMessage(message);
      listItem.setFeedType(this.feedType);
      listItem.setOnMessageClick((message) => {
        if (this.onMessageClick) {
          this.onMessageClick(message, index);
        }
      });
      this.list.appendChild(listItem);
    });
  }
}

if (!customElements.get('courier-inbox-list')) {
  customElements.define('courier-inbox-list', CourierInboxList);
}
