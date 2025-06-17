import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierBaseElement, CourierInfoState, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxListItem } from "./courier-inbox-list-item";
import { CourierInboxPaginationListItem } from "./courier-inbox-pagination-list-item";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxStateErrorFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps } from "../types/factories";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxSkeletonList } from "./courier-inbox-skeleton-list";
import { CourierInboxListItemMenu } from "./courier-inbox-list-item-menu";

export class CourierInboxList extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-list';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _messages: InboxMessage[] = [];
  private _feedType: CourierInboxFeedType = 'inbox';
  private _isLoading = true;
  private _error: Error | null = null;
  private _canPaginate = false;

  // Callbacks
  private _onMessageClick: ((message: InboxMessage, index: number) => void) | null = null;
  private _onMessageActionClick: ((message: InboxMessage, action: InboxAction, index: number) => void) | null = null;
  private _onMessageLongPress: ((message: InboxMessage, index: number) => void) | null = null;
  private _onRefresh: () => void;

  // Factories
  private _onPaginationTrigger?: (feedType: CourierInboxFeedType) => void;
  private _listItemFactory?: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement;
  private _paginationItemFactory?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement;
  private _loadingStateFactory?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement;
  private _emptyStateFactory?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement;
  private _errorStateFactory?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement;

  // Getters
  public get messages(): InboxMessage[] {
    return this._messages;
  }

  // Components
  private _style?: HTMLStyleElement;

  constructor(props: {
    themeManager: CourierInboxThemeManager,
    onRefresh: () => void,
    onPaginationTrigger: (feedType: CourierInboxFeedType) => void,
    onMessageClick: (message: InboxMessage, index: number) => void,
    onMessageActionClick: (message: InboxMessage, action: InboxAction, index: number) => void,
    onMessageLongPress: (message: InboxMessage, index: number) => void
  }) {
    super();

    // Initialize the callbacks
    this._onRefresh = props.onRefresh;
    this._onPaginationTrigger = props.onPaginationTrigger;
    this._onMessageClick = props.onMessageClick;
    this._onMessageActionClick = props.onMessageActionClick;
    this._onMessageLongPress = props.onMessageLongPress;

    // Initialize the theme subscription
    this._themeSubscription = props.themeManager.subscribe((_: CourierInboxTheme) => {
      this.refreshTheme();
    });

  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxList.id, this.getStyles());
    this.render();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();

    // Remove list item styles
    [CourierInboxListItem.id, CourierInboxListItemMenu.id].forEach(id => {
      const style = document.head.querySelector(`data-${id}`);
      style?.remove();
    });
  }

  getStyles(): string {
    const list = this._themeSubscription.manager.getTheme().inbox?.list;

    return `
      ${CourierInboxList.id} {
        flex: 1;
        width: 100%;
        background-color: ${list?.backgroundColor ?? 'red'};
      }

      ${CourierInboxList.id} ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
      }
    `;
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

  private handleRetry(): void {
    this._onRefresh();
  }

  private handleRefresh(): void {
    this._onRefresh();
  }

  private render(): void {

    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    const theme = this._themeSubscription.manager.getTheme();

    if (this._style) {
      this._style.textContent = this.getStyles();
    }

    // Error state
    if (this._error) {
      const error = theme.inbox?.error;
      const errorElement = new CourierInfoState({
        title: {
          text: error?.title?.text ?? this._error.message,
          textColor: error?.title?.font?.color,
          fontFamily: error?.title?.font?.family,
          fontSize: error?.title?.font?.size,
          fontWeight: error?.title?.font?.weight
        },
        button: {
          text: error?.button?.text,
          backgroundColor: error?.button?.backgroundColor,
          hoverBackgroundColor: error?.button?.hoverBackgroundColor,
          activeBackgroundColor: error?.button?.activeBackgroundColor,
          textColor: error?.button?.font?.color,
          fontFamily: error?.button?.font?.family,
          fontSize: error?.button?.font?.size,
          fontWeight: error?.button?.font?.weight,
          shadow: error?.button?.shadow,
          border: error?.button?.border,
          borderRadius: error?.button?.borderRadius
        }
      });
      errorElement.build(this._errorStateFactory?.({ feedType: this._feedType, error: this._error }));
      errorElement.setButtonClickCallback(() => this.handleRetry());
      this.appendChild(errorElement);
      return;
    }

    // Loading state
    if (this._isLoading) {
      const loadingElement = new CourierInboxSkeletonList(theme);
      loadingElement.build(this._loadingStateFactory?.({ feedType: this._feedType }));
      this.appendChild(loadingElement);
      return;
    }

    // Empty state
    if (this._messages.length === 0) {
      const empty = theme.inbox?.empty;
      const emptyElement = new CourierInfoState({
        title: {
          text: empty?.title?.text ?? `No ${this._feedType} messages yet`,
          textColor: empty?.title?.font?.color,
          fontFamily: empty?.title?.font?.family,
          fontSize: empty?.title?.font?.size,
          fontWeight: empty?.title?.font?.weight
        },
        button: {
          text: empty?.button?.text,
          backgroundColor: empty?.button?.backgroundColor,
          hoverBackgroundColor: empty?.button?.hoverBackgroundColor,
          activeBackgroundColor: empty?.button?.activeBackgroundColor,
          textColor: empty?.button?.font?.color,
          fontFamily: empty?.button?.font?.family,
          fontSize: empty?.button?.font?.size,
          fontWeight: empty?.button?.font?.weight,
          shadow: empty?.button?.shadow,
          border: empty?.button?.border,
          borderRadius: empty?.button?.borderRadius
        }
      });
      emptyElement.build(this._emptyStateFactory?.({ feedType: this._feedType }));
      emptyElement.setButtonClickCallback(() => this.handleRefresh());
      this.appendChild(emptyElement);
      return;
    }

    // Create list before adding messages
    const list = document.createElement('ul');
    this.appendChild(list);

    // Add messages to the list
    this._messages.forEach((message, index) => {
      if (this._listItemFactory) {
        list.appendChild(this._listItemFactory({ message, index }));
        return;
      }

      const listItem = new CourierInboxListItem(theme);
      listItem.setMessage(message, this._feedType);
      listItem.setOnItemClick((message) => this._onMessageClick?.(message, index));
      listItem.setOnItemActionClick((message, action) => this._onMessageActionClick?.(message, action, index));
      listItem.setOnItemLongPress((message) => this._onMessageLongPress?.(message, index));
      list.appendChild(listItem);
    });

    // Add pagination item if can paginate
    if (this._canPaginate) {
      const paginationItem = new CourierInboxPaginationListItem({
        theme: theme,
        customItem: this._paginationItemFactory?.({ feedType: this._feedType }),
        onPaginationTrigger: () => this._onPaginationTrigger?.(this._feedType),
      });
      list.appendChild(paginationItem);
    }
  }

  // Factories
  public setLoadingStateFactory(factory: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement): void {
    this._loadingStateFactory = factory;
    this.render();
  }

  public setEmptyStateFactory(factory: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement): void {
    this._emptyStateFactory = factory;
    this.render();
  }

  public setErrorStateFactory(factory: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement): void {
    this._errorStateFactory = factory;
    this.render();
  }

  public setListItemFactory(factory: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement): void {
    this._listItemFactory = factory;
    this.render();
  }

  public setPaginationItemFactory(factory: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement): void {
    this._paginationItemFactory = factory;
    this.render();
  }

  public refreshTheme(): void {
    this.render();
  }

}

registerElement(CourierInboxList);
