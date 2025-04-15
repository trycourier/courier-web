import { InboxMessage } from "@trycourier/courier-js";
import { FeedType } from "../types/feed-type";
import { CourierInfoState, CourierLoadingState } from "@trycourier/courier-ui-core";
import { CourierListItem } from "./courier-inbox-list-item";
import { CourierInboxPaginationListItem } from "./courier-inbox-pagination-list-item";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxDatastore } from "../datastore/datastore";

export class CourierInboxList extends HTMLElement {
  private list: HTMLUListElement;
  private _messages: InboxMessage[] = [];
  private feedType: FeedType = 'inbox';
  private isLoading = true;
  private error: Error | null = null;
  private onMessageClick: ((message: InboxMessage, index: number) => void) | null = null;
  private canPaginate = false;
  private onRefresh: () => void;

  public get messages(): InboxMessage[] {
    return this._messages;
  }

  constructor({ onRefresh }: { onRefresh: () => void }) {
    super();
    this.onRefresh = onRefresh;
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

  public setDataSet(dataSet: InboxDataSet): void {
    this._messages = [...dataSet.messages]; // Create a new array to avoid reference issues
    this.canPaginate = Boolean(dataSet.canPaginate); // Create a new boolean to avoid reference issues
    this.error = null;
    this.isLoading = false;
    this.updateItems();
  }

  public addMessage(message: InboxMessage, index = 0): void {
    this._messages.splice(index, 0, message);
    this.updateItems();
  }

  public removeMessage(index = 0): void {
    this._messages.splice(index, 1);
    this.updateItems();
  }

  public updateMessage(message: InboxMessage, index = 0): void {
    this._messages[index] = message;
    this.updateItems();
  }

  public setFeedType(feedType: FeedType): void {
    this.feedType = feedType;
    this.error = null;
    this.isLoading = true;
    this.updateItems();
  }

  public setLoading(isLoading: boolean): void {
    this.error = null;
    this.isLoading = isLoading;
    this.updateItems();
  }

  public setError(error: Error | null): void {
    this.error = error;
    this.isLoading = false;
    this._messages = [];
    this.updateItems();
  }

  public setErrorNoClient(): void {
    this.setError(new Error('No user signed in'));
  }

  private getEmptyText(): string {
    return `No ${this.feedType} messages yet`;
  }

  private handleRetry(): void {
    this.onRefresh();
  }

  private handleRefresh(): void {
    this.onRefresh();
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

    if (this._messages.length === 0) {
      const emptyElement = new CourierInfoState();
      emptyElement.setButtonText('Refresh');
      emptyElement.setButtonVariant('secondary');
      emptyElement.setButtonSize('small');
      emptyElement.setTitle(this.getEmptyText());
      emptyElement.setButtonClickCallback(() => this.handleRefresh());
      this.list.appendChild(emptyElement);
      return;
    }

    this._messages.forEach((message, index) => {
      const listItem = new CourierListItem();
      listItem.setMessage(message);
      listItem.setFeedType(this.feedType);
      listItem.setOnMessageClick((message) => {
        if (this.onMessageClick) {
          this.onMessageClick(message, index);
        }
      });
      listItem.setOnCloseClick((message) => {
        CourierInboxDatastore.shared.archiveMessage(message, index);
      });
      this.list.appendChild(listItem);
    });

    if (this.canPaginate) {
      const paginationItem = new CourierInboxPaginationListItem();
      paginationItem.setAttribute('loading', 'true');
      this.list.appendChild(paginationItem);
    }
  }

}

if (!customElements.get('courier-inbox-list')) {
  customElements.define('courier-inbox-list', CourierInboxList);
}
