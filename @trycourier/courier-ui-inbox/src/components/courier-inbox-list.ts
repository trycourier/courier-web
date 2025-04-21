import { InboxMessage } from "@trycourier/courier-js";
import { CourierInfoState, CourierLoadingState } from "@trycourier/courier-ui-core";
import { CourierListItem } from "./courier-inbox-list-item";
import { CourierInboxPaginationListItem } from "./courier-inbox-pagination-list-item";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxEmptyStateFactory, CourierInboxErrorStateFactory, CourierInboxLoadingStateFactory, CourierInboxStateErrorFactoryProps, CourierInboxStateFactoryProps } from "../types/factories";

export class CourierInboxList extends HTMLElement {
  private _list?: HTMLUListElement;
  private _messages: InboxMessage[] = [];
  private _feedType: CourierInboxFeedType = 'inbox';
  private _isLoading = true;
  private _error: Error | null = null;
  private _canPaginate = false;
  private _onMessageClick: ((message: InboxMessage, index: number) => void) | null = null;
  private _onArchiveMessage: ((message: InboxMessage, index: number) => void) | null = null;
  private _onRefresh: () => void;
  private _onPaginationTrigger?: (feedType: CourierInboxFeedType) => void;
  private _listItemFactory?: (message: InboxMessage, index: number) => HTMLElement;
  private _paginationItemFactory?: (feedType: CourierInboxFeedType) => HTMLElement;
  private _loadingStateFactory?: (props: CourierInboxStateFactoryProps | undefined | null) => HTMLElement;
  private _emptyStateFactory?: (props: CourierInboxStateFactoryProps | undefined | null) => HTMLElement;
  private _errorStateFactory?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement;

  public get messages(): InboxMessage[] {
    return this._messages;
  }

  constructor(props: {
    onRefresh: () => void,
    onPaginationTrigger: (feedType: CourierInboxFeedType) => void,
    onMessageClick: (message: InboxMessage, index: number) => void,
    onArchiveMessage: (message: InboxMessage, index: number) => void
  }) {
    super();

    // Initialize the callbacks
    this._onRefresh = props.onRefresh;
    this._onPaginationTrigger = props.onPaginationTrigger;
    this._onMessageClick = props.onMessageClick;
    this._onArchiveMessage = props.onArchiveMessage;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.getStyles();
    shadow.appendChild(style);
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

  private reset(): void {
    // Remove any existing elements from the shadow root
    while (this.shadowRoot?.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    // Re-add the style element
    const style = document.createElement('style');
    style.textContent = this.getStyles();
    this.shadowRoot?.appendChild(style);
  }

  public setLoadingStateFactory(factory: (props: CourierInboxStateFactoryProps | undefined | null) => HTMLElement): void {
    this._loadingStateFactory = factory;
    this.render();
  }

  public setEmptyStateFactory(factory: (props: CourierInboxStateFactoryProps | undefined | null) => HTMLElement): void {
    this._emptyStateFactory = factory;
    this.render();
  }

  public setErrorStateFactory(factory: (props: CourierInboxStateFactoryProps | undefined | null) => HTMLElement): void {
    this._errorStateFactory = factory;
    this.render();
  }

  public setListItemFactory(factory: (message: InboxMessage, index: number) => HTMLElement): void {
    this._listItemFactory = factory;
    this.render();
  }

  public setPaginationItemFactory(factory: (feedType: CourierInboxFeedType) => HTMLElement): void {
    this._paginationItemFactory = factory;
    this.render();
  }

  public setDataSet(dataSet: InboxDataSet): void {
    this._messages = [...dataSet.messages];
    this._canPaginate = Boolean(dataSet.canPaginate);
    this._error = null;
    this._isLoading = false;
    this.render();
  }

  public addPage(dataSet: InboxDataSet): void {
    this._messages = [...this._messages, ...dataSet.messages];
    this._canPaginate = Boolean(dataSet.canPaginate);
    this._error = null;
    this._isLoading = false;
    this.render();
  }

  public addMessage(message: InboxMessage, index = 0): void {
    this._messages.splice(index, 0, message);
    this.render();
  }

  public removeMessage(index = 0): void {
    this._messages.splice(index, 1);
    this.render();
  }

  public updateMessage(message: InboxMessage, index = 0): void {
    this._messages[index] = message;
    this.render();
  }

  public setFeedType(feedType: CourierInboxFeedType): void {
    this._feedType = feedType;
    this._error = null;
    this._isLoading = true;
    this.render();
  }

  public setLoading(isLoading: boolean): void {
    this._error = null;
    this._isLoading = isLoading;
    this.render();
  }

  public setError(error: Error | null): void {
    this._error = error;
    this._isLoading = false;
    this._messages = [];
    this.render();
  }

  public setErrorNoClient(): void {
    this.setError(new Error('No user signed in'));
  }

  private getEmptyText(): string {
    return `No ${this._feedType} messages yet`;
  }

  private handleRetry(): void {
    this._onRefresh();
  }

  private handleRefresh(): void {
    this._onRefresh();
  }

  private render(): void {
    this.reset();

    // Error state
    if (this._error) {
      const errorElement = new CourierInfoState();
      errorElement.build(this._errorStateFactory?.({ feedType: this._feedType, error: this._error }));
      errorElement.setButtonText('Retry');
      errorElement.setButtonVariant('secondary');
      errorElement.setTitle(this._error.message);
      errorElement.setButtonClickCallback(() => this.handleRetry());
      this.shadowRoot?.appendChild(errorElement);
      return;
    }

    // Loading state
    if (this._isLoading) {
      const loadingElement = new CourierLoadingState();
      loadingElement.build(this._loadingStateFactory?.({ feedType: this._feedType }));
      this.shadowRoot?.appendChild(loadingElement);
      return;
    }

    // Empty state
    if (this._messages.length === 0) {
      const emptyElement = new CourierInfoState();
      emptyElement.build(this._emptyStateFactory?.({ feedType: this._feedType }));
      emptyElement.setButtonText('Refresh');
      emptyElement.setButtonVariant('secondary');
      emptyElement.setTitle(this.getEmptyText());
      emptyElement.setButtonClickCallback(() => this.handleRefresh());
      this.shadowRoot?.appendChild(emptyElement);
      return;
    }

    // Create list before adding messages
    this._list = document.createElement('ul');
    this.shadowRoot?.appendChild(this._list);

    // Add messages to the list
    this._messages.forEach((message, index) => {
      if (this._listItemFactory) {
        this._list?.appendChild(this._listItemFactory(message, index));
        return;
      }

      const listItem = new CourierListItem();
      listItem.setMessage(message, this._feedType);
      listItem.setOnItemClick((message) => this._onMessageClick?.(message, index));
      listItem.setOnCloseClick((message) => this._onArchiveMessage?.(message, index));
      this._list?.appendChild(listItem);
    });

    // Add pagination item if can paginate
    if (this._canPaginate) {
      const paginationItem = new CourierInboxPaginationListItem({
        customItem: this._paginationItemFactory?.(this._feedType),
        onPaginationTrigger: () => this._onPaginationTrigger?.(this._feedType),
      });
      this._list?.appendChild(paginationItem);
    }
  }
}

if (!customElements.get('courier-inbox-list')) {
  customElements.define('courier-inbox-list', CourierInboxList);
}
