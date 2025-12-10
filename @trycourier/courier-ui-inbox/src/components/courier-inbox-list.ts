import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierBaseElement, CourierInfoState, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxListItem } from "./courier-inbox-list-item";
import { CourierInboxPaginationListItem } from "./courier-inbox-pagination-list-item";
import { InboxDataSet } from "../types/inbox-data-set";
import { CourierInboxStateErrorFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps } from "../types/factories";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxSkeletonList } from "./courier-inbox-skeleton-list";
import { CourierInboxListItemMenu } from "./courier-inbox-list-item-menu";
import { openMessage } from "../utils/extensions";
import { CourierInbox } from "./courier-inbox";

export class CourierInboxList extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-list';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _messages: InboxMessage[] = [];
  private _datasetId: string = CourierInbox.defaultFeeds()[0].tabs[0].id;
  private _isLoading = true;
  private _error: Error | null = null;
  private _canPaginate = false;
  private _canClickListItems = false;
  private _canLongPressListItems = false;

  // Callbacks
  private _onMessageClick: ((message: InboxMessage, index: number) => void) | null = null;
  private _onMessageActionClick: ((message: InboxMessage, action: InboxAction, index: number) => void) | null = null;
  private _onMessageLongPress: ((message: InboxMessage, index: number) => void) | null = null;
  private _onRefresh: () => void;

  // Factories
  private _onPaginationTrigger?: (feedId: string) => void;
  private _listItemFactory?: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement;
  private _paginationItemFactory?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement;
  private _loadingStateFactory?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement;
  private _emptyStateFactory?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement;
  private _errorStateFactory?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement;

  // Getters
  public get messages(): InboxMessage[] {
    return this._messages;
  }

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  // Components
  private _listStyles?: HTMLStyleElement;
  private _listItemStyles?: HTMLStyleElement;
  private _listItemMenuStyles?: HTMLStyleElement;
  private _errorContainer?: CourierInfoState;
  private _emptyContainer?: CourierInfoState;

  constructor(props: {
    themeManager: CourierInboxThemeManager,
    canClickListItems: boolean,
    canLongPressListItems: boolean,
    onRefresh: () => void,
    onPaginationTrigger: (feedType: string) => void,
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
      this.render();
    });

  }

  onComponentMounted() {

    // Inject styles at head
    // Since list items and menus don't listen to theme changes directly, their styles are created
    // at the parent level, and the parent manages their theming updates.
    this._listStyles = injectGlobalStyle(CourierInboxList.id, CourierInboxList.getStyles(this.theme));
    this._listItemStyles = injectGlobalStyle(CourierInboxListItem.id, CourierInboxListItem.getStyles(this.theme));
    this._listItemMenuStyles = injectGlobalStyle(CourierInboxListItemMenu.id, CourierInboxListItemMenu.getStyles(this.theme));

    // Layout the component
    this.render();

  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._listStyles?.remove();
    this._listItemStyles?.remove();
    this._listItemMenuStyles?.remove();
  }

  public setCanClickListItems(canClick: boolean) {
    this._canClickListItems = canClick;
  }

  public setCanLongPressListItems(canLongPress: boolean) {
    this._canLongPressListItems = canLongPress;
  }

  static getStyles(theme: CourierInboxTheme): string {

    const list = theme.inbox?.list;
    const scrollbar = list?.scrollbar;

    return `
      ${CourierInboxList.id} {
        flex: 1;
        width: 100%;
        background-color: ${list?.backgroundColor ?? 'red'};
        scrollbar-width: ${scrollbar?.width ?? 'thin'};
        scrollbar-color: ${scrollbar?.thumbColor ?? 'rgba(0, 0, 0, 0.2)'} ${scrollbar?.trackBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxList.id} ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
      }

      /* Webkit scrollbar styling - show thumb, hide track background, overlay above content */
      ${CourierInboxList.id}::-webkit-scrollbar {
        width: ${scrollbar?.width ?? '8px'};
        height: ${scrollbar?.height ?? '8px'};
      }

      ${CourierInboxList.id}::-webkit-scrollbar-track {
        background: ${scrollbar?.trackBackgroundColor ?? 'transparent'};
      }

      ${CourierInboxList.id}::-webkit-scrollbar-thumb {
        background: ${scrollbar?.thumbColor ?? 'rgba(0, 0, 0, 0.2)'};
        border-radius: ${scrollbar?.borderRadius ?? '4px'};
      }

      ${CourierInboxList.id}::-webkit-scrollbar-thumb:hover {
        background: ${scrollbar?.thumbHoverColor ?? scrollbar?.thumbColor ?? 'rgba(0, 0, 0, 0.3)'};
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

  public selectDataset(datasetId: string): void {
    this._datasetId = datasetId;
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

  public refreshInfoStateThemes() {
    this._emptyContainer?.updateStyles(this.errorProps);
    this._emptyContainer?.updateStyles(this.emptyProps);
  }

  get errorProps(): any {
    const error = this.theme.inbox?.error;
    const themeMode = this._themeSubscription.manager.mode;
    return {
      title: {
        text: error?.title?.text ?? this._error?.message,
        textColor: error?.title?.font?.color,
        fontFamily: error?.title?.font?.family,
        fontSize: error?.title?.font?.size,
        fontWeight: error?.title?.font?.weight
      },
      button: {
        mode: themeMode,
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
        borderRadius: error?.button?.borderRadius,
        onClick: () => this.handleRetry()
      }
    };
  }

  get emptyProps(): any {
    const empty = this.theme.inbox?.empty;
    const themeMode = this._themeSubscription.manager.mode;
    return {
      title: {
        text: empty?.title?.text ?? `No Messages`,
        textColor: empty?.title?.font?.color,
        fontFamily: empty?.title?.font?.family,
        fontSize: empty?.title?.font?.size,
        fontWeight: empty?.title?.font?.weight
      },
      button: {
        mode: themeMode,
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
        borderRadius: empty?.button?.borderRadius,
        onClick: () => this.handleRefresh()
      },
    };
  }

  private render(): void {

    // Remove all existing elements
    while (this.firstChild) {
      this.removeChild(this.firstChild);
      this._errorContainer = undefined;
      this._emptyContainer = undefined;
    }

    // Update list styles
    if (this._listStyles) {
      this._listStyles.textContent = CourierInboxList.getStyles(this.theme);
    }

    // Update list item styles
    if (this._listItemStyles) {
      this._listItemStyles.textContent = CourierInboxListItem.getStyles(this.theme);
    }

    // Update list item menu styles
    if (this._listItemMenuStyles) {
      this._listItemMenuStyles.textContent = CourierInboxListItemMenu.getStyles(this.theme);
    }

    // Error state
    if (this._error) {
      this._errorContainer = new CourierInfoState(this.errorProps);
      this._errorContainer.build(this._errorStateFactory?.({ feedType: this._datasetId, error: this._error }));
      this.appendChild(this._errorContainer);
      return;
    }

    // Loading state
    if (this._isLoading) {
      const loadingElement = new CourierInboxSkeletonList(this.theme);
      loadingElement.build(this._loadingStateFactory?.({ feedType: this._datasetId }));
      this.appendChild(loadingElement);
      return;
    }

    // Empty state
    if (this._messages.length === 0) {
      this._emptyContainer = new CourierInfoState(this.emptyProps);
      this._emptyContainer.build(this._emptyStateFactory?.({ feedType: this._datasetId }));
      this.appendChild(this._emptyContainer);
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
      const listItem = new CourierInboxListItem(this._themeSubscription.manager, this._canClickListItems, this._canLongPressListItems);
      listItem.setMessage(message);
      listItem.setOnItemClick((message) => this._onMessageClick?.(message, index));
      listItem.setOnItemActionClick((message, action) => this._onMessageActionClick?.(message, action, index));
      listItem.setOnItemLongPress((message) => this._onMessageLongPress?.(message, index));
      listItem.setOnItemVisible((message) => this.openVisibleMessage(message))
      list.appendChild(listItem);
    });

    // Add pagination item if can paginate
    if (this._canPaginate) {
      const paginationItem = new CourierInboxPaginationListItem({
        theme: this.theme,
        customItem: this._paginationItemFactory?.({ feedType: this._datasetId }),
        onPaginationTrigger: () => this._onPaginationTrigger?.(this._datasetId),
      });
      list.appendChild(paginationItem);
    }
  }

  private async openVisibleMessage(message: InboxMessage) {
    try {
      await openMessage(message);
    } catch (error) {
      // Error ignored. Will get logged in the openMessage function
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

  public scrollToTop(animate: boolean = true): void {
    this.scrollTo({ top: 0, behavior: animate ? 'smooth' : 'instant' });
  }

}

registerElement(CourierInboxList);
