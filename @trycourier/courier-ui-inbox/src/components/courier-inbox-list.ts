import { InboxMessage } from "@trycourier/courier-js";
import { CourierInfoState, CourierLoadingState } from "@trycourier/courier-ui-core";
import { CourierListItem } from "./courier-inbox-list-item";
import { CourierInboxPaginationListItem } from "./courier-inbox-pagination-list-item";
import { InboxDataSet } from "../types/inbox-data-set";
import { FeedType } from "../types/feed-type";

export class CourierInboxList extends HTMLElement {
  private list: HTMLUListElement;
  private _messages: InboxMessage[] = [];
  private feedType: FeedType = 'inbox';
  private isLoading = true;
  private error: Error | null = null;
  private canPaginate = false;
  private onMessageClick: ((message: InboxMessage, index: number) => void) | null = null;
  private onArchiveMessage: ((message: InboxMessage, index: number) => void) | null = null;
  private onRefresh: () => void;
  private onPaginationTrigger?: (feedType: FeedType) => void;
  private listItemFactory?: (message: InboxMessage, index: number) => HTMLElement;
  private paginationItemFactory?: (feedType: FeedType) => HTMLElement;

  public get messages(): InboxMessage[] {
    return this._messages;
  }

  constructor(props: {
    onRefresh: () => void,
    onPaginationTrigger: (feedType: FeedType) => void,
    onMessageClick: (message: InboxMessage, index: number) => void,
    onArchiveMessage: (message: InboxMessage, index: number) => void
  }) {
    super();

    // Initialize the callbacks
    this.onRefresh = props.onRefresh;
    this.onPaginationTrigger = props.onPaginationTrigger;
    this.onMessageClick = props.onMessageClick;
    this.onArchiveMessage = props.onArchiveMessage;

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

  public setListItemFactory(factory: (message: InboxMessage, index: number) => HTMLElement): void {
    this.listItemFactory = factory;
    this.updateItems();
  }

  public setPaginationItemFactory(factory: (feedType: FeedType) => HTMLElement): void {
    console.log('setting pagination item factory', factory);
    this.paginationItemFactory = factory;
    this.updateItems();
  }

  public setDataSet(dataSet: InboxDataSet): void {
    // New objects are created to avoid reference issues
    this._messages = [...dataSet.messages];
    this.canPaginate = Boolean(dataSet.canPaginate);
    this.error = null;
    this.isLoading = false;
    this.updateItems();
  }

  public addPage(dataSet: InboxDataSet): void {
    this._messages = [...this._messages, ...dataSet.messages];
    this.canPaginate = Boolean(dataSet.canPaginate);
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

      // Use the custom list item if it is set
      if (this.listItemFactory) {
        this.list.appendChild(this.listItemFactory(message, index));
        return;
      }

      // Use the default list item if no custom list item is set
      const listItem = new CourierListItem();
      listItem.setMessage(message, this.feedType);
      listItem.setOnItemClick((message) => this.onMessageClick?.(message, index));
      listItem.setOnCloseClick((message) => this.onArchiveMessage?.(message, index));
      this.list.appendChild(listItem);

    });

    if (this.canPaginate) {

      console.log('this.paginationItemFactory', this.paginationItemFactory);

      const paginationItem = new CourierInboxPaginationListItem({
        customItem: this.paginationItemFactory?.(this.feedType),
        onPaginationTrigger: () => this.onPaginationTrigger?.(this.feedType),
      });
      this.list.appendChild(paginationItem);
    }
  }
}

if (!customElements.get('courier-inbox-list')) {
  customElements.define('courier-inbox-list', CourierInboxList);
}
