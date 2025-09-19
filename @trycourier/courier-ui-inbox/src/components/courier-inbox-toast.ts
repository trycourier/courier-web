import { CourierBaseElement, CourierComponentThemeMode, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme, defaultLightTheme } from "../types/courier-inbox-theme";
import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxToastItem } from "./courier-inbox-toast-item";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxToastItemAddedEvent, CourierInboxToastItemClickedEvent, CourierInboxToastItemDismissedEvent, CourierInboxToastItemFactoryProps } from "../types/factories";

export class CourierInboxToast extends CourierBaseElement {

  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;
  private _toastStyle?: HTMLStyleElement;
  private _authListener?: AuthenticationListener;
  private _datastoreListener: CourierInboxDataStoreListener = new CourierInboxDataStoreListener({
    onMessageAdd: this.datastoreAddMessageListener.bind(this),
  });

  private _autoDismiss: boolean = false;
  private _autoDismissTimeoutMs: number = 5000;
  private _customToastItem?: (props: CourierInboxToastItemFactoryProps | undefined | null) => HTMLElement;
  private _customToastItemContent?: (props: CourierInboxToastItemFactoryProps | undefined | null) => HTMLElement;

  // Callbacks
  private onItemDismissedCallback?: ((props: CourierInboxToastItemDismissedEvent) => void);
  private onItemClickedCallback?: ((props: CourierInboxToastItemClickedEvent) => void);
  private onItemAddedCallback?: ((props: CourierInboxToastItemAddedEvent) => void);

  private _defaultProps = {
    width: '380px',
    height: '100px',
    top: '30px',
    right: '30px',
  };

  static observedAttributes = [
    'auto-dismiss',
    'auto-dismiss-timeout-ms',
    'light-theme',
    'dark-theme',
    'mode',
  ];

  constructor(props: {
    themeManager?: CourierInboxThemeManager
  }) {
    super();

    this._themeManager = props?.themeManager ?? new CourierInboxThemeManager(defaultLightTheme);
    this._themeSubscription = this._themeManager.subscribe((_: CourierInboxTheme) => {
      this.refreshStyles();
    });
  }

  /**
   * Add and immediately show an {@link InboxMessage} toast item.
   *
   * <p>Useful to send test messages while developing with the Courier SDK.</p>
   *
   * <p>Example:</p>
   *
   * <pre>
   * const toast = document.getElementById("my-toast");
   *
   * toast.addInboxMessage({
   *  title: 'Lorem ipsum dolor sit',
   *  body: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
   *  messageId: '1'
   * });
   * </pre>
   *
   * @param message The message to add as a toast item.
   */
  public addInboxMessage(message: InboxMessage) {
    this.addToastItem(message);
  }

  public onToastItemDismissed(cb?: (props: CourierInboxToastItemDismissedEvent) => void): void {
    this.onItemDismissedCallback = cb;
  }

  public onToastItemClicked(cb?: (props: CourierInboxToastItemClickedEvent) => void): void {
    this.onItemClickedCallback = cb;
  }

  public onToastItemAdded(cb?: (props: CourierInboxToastItemAddedEvent) => void): void {
    this.onItemAddedCallback = cb;
  }

  /** Enable auto-dismiss for toast items. */
  public enableAutoDismiss() {
    this._autoDismiss = true;
  }

  /** Disable auto-dismiss for toast items. */
  public disableAutoDismiss() {
    this._autoDismiss = false;
  }

  /**
   * Set the timeout before auto-dismissing toasts.
   * Only applicable if auto-dismiss is enabled.
   * @param timeoutMs The timeout in milliseconds before a toast is dismissed.
   */
  public setAutoDismissTimeoutMs(timeoutMs: number) {
    this._autoDismissTimeoutMs = timeoutMs;
  }

  /**
   * Set the light theme for the inbox.
   * @param theme The light theme object to set.
   */
  public setLightTheme(theme: CourierInboxTheme) {
    this._themeManager.setLightTheme(theme);
  }

  /**
   * Set the dark theme for the inbox.
   * @param theme The dark theme object to set.
   */
  public setDarkTheme(theme: CourierInboxTheme) {
    this._themeManager.setDarkTheme(theme);
  }

  /**
   * Set the theme mode manually.
   *
   * @param mode The theme mode, one of "dark", "light", or "system".
   */
  public setMode(mode: CourierComponentThemeMode) {
    this._themeManager.setMode(mode);
  }

  public setToastItem(factory: (props: CourierInboxToastItemFactoryProps | undefined | null) => HTMLElement) {
    this._customToastItem = factory;
  }

  public setToastItemContent(factory: (props: CourierInboxToastItemFactoryProps | undefined | null) => HTMLElement) {
    this._customToastItemContent = factory;
  }

  /** @override */
  protected onComponentMounted(): void {
    this._toastStyle = injectGlobalStyle(CourierInboxToast.id, this.getStyles(this.theme));

    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);
    Courier.shared.addAuthenticationListener(this.authChangedCallback.bind(this));
    CourierInboxDatastore.shared.listenForUpdates();
  }

  /** @override */
  protected onComponentUnmounted(): void {
    this._datastoreListener.remove();
    this._authListener?.remove();
    this._toastStyle?.remove();
    this._themeManager.cleanup();
    this._themeSubscription.unsubscribe();
  }

  /** @override */
  protected attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case 'auto-dismiss':
        if (newValue === 'false') {
          this.disableAutoDismiss();
        } else {
          this.enableAutoDismiss();
        }
        break;
      case 'auto-dismiss-timeout-ms':
        this.setAutoDismissTimeoutMs(parseInt(newValue, /* base= */ 10));
        break;
      case 'light-theme':
        if (newValue) {
          this.setLightTheme(JSON.parse(newValue));
        }
        break;
      case 'dark-theme':
        if (newValue) {
          this.setDarkTheme(JSON.parse(newValue));
        }
        break;
      case 'mode':
        this._themeManager.setMode(newValue as CourierComponentThemeMode);
        break;
    }
  }

  private get theme(): CourierInboxTheme {
    return this._themeManager.getTheme();
  }

  private refreshStyles() {
    if (this._toastStyle) {
      this._toastStyle.textContent = this.getStyles(this.theme);
    }
  }

  private authChangedCallback() {
    this.removeAllItems();
    CourierInboxDatastore.shared.listenForUpdates();
  }

  private removeAllItems(): void {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  private addToastItem(message: InboxMessage): void {
    const toastItem = this.getToastItem(message);
    this.appendChild(toastItem);
    this.style.height = this.topStackItemHeight;

    if (this.onItemAddedCallback) {
      this.onItemAddedCallback({ toastItem, message });
    }
  }

  private getToastItem(message: InboxMessage): CourierInboxToastItem | HTMLElement {
    if (this._customToastItem) {
      return this._customToastItem({
        message,
      });
    }

    const item = new CourierInboxToastItem({
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
      themeManager: this._themeManager
    });

    if (this._customToastItemContent) {
      item.setToastItemContent(this._customToastItemContent);
    }

    item.setMessage(message);

    if (this.onItemClickedCallback) {
      item.onItemClicked(this.onItemClickedCallback);
    }

    const stack = this;
    item.onItemDismissed((_) => {
      stack.style.height = this.topStackItemHeight;

      if (this.onItemDismissedCallback) {
        this.onItemDismissedCallback({ message });
      }
    });

    return item;
  }

  private datastoreAddMessageListener(message: InboxMessage, _: number, feedType: CourierInboxFeedType) {
    if (feedType !== 'inbox') {
      return;
    }

    this.addToastItem(message);
  }

  private getStyles(theme: CourierInboxTheme): string {
    const item = theme.toast?.item;

    // Styles for the top-level toast container.
    const toastStyles = `
      ${CourierInboxToast.id} {
        position: fixed;
        z-index: 999;
        top: ${this._defaultProps.top};
        right: ${this._defaultProps.right};
        width: ${this._defaultProps.width};
        height: ${this._defaultProps.height};
      }
    `;

    // Stack the three most recently shown toast items and hide all others.
    // Content is transparent for all but the most recent (top) toast item
    // since it otherwise peeks out in the visible stack items.
    const toastStackStyles = `
      ${CourierInboxToastItem.id}:last-child {
        top: 0;
        right: 0;
      }

      ${CourierInboxToastItem.id}:nth-last-child(2) {
        top: 12px;
        bottom: -12px;
        --scale: 0.95
      }

      ${CourierInboxToastItem.id}:nth-last-child(3) {
        top: 24px;
        bottom: -24px;
        --scale: 0.9;
      }

      ${CourierInboxToastItem.id}:nth-last-child(n+4) {
        top: 24px;
        bottom: -24px;
        --scale: 0.9;
        visibility: hidden;
      }

      ${CourierInboxToastItem.id}:nth-last-child(n+2) > .overflow-hidden-container > .content > .text-content > .title,
      ${CourierInboxToastItem.id}:nth-last-child(n+2) > .overflow-hidden-container > .content > .text-content > .body {
        color: rgba(255, 255, 255, 0);
      }
    `;

    // Styles for the visible toast item.
    // `opacity` and `transform` are the initial states before
    // the keyframed `animation` show is applied.
    // The class `dismissing` is added to trigger the `animation` hide
    // before removing an item.
    // Only the top item is clickable.
    const toastItemStyles = `
      ${CourierInboxToastItem.id} {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        background-color: ${item?.backgroundColor};
        box-shadow: ${item?.shadow};
        border: ${item?.border};
        border-radius: ${item?.borderRadius};
        transition: 0.2s ease-in-out;
        cursor: default;

        opacity: 0;
        transform: translate(0, -10px) scaleX(var(--scale, 1));
        animation: show 0.3s ease-in-out forwards;
      }

      ${CourierInboxToastItem.id} > .overflow-hidden-container {
        height: 100%;
        width: 100%;
        border-radius: ${item?.borderRadius};
        overflow: hidden;
      }

      ${CourierInboxToastItem.id}.dismissing {
        animation: hide 0.3s ease-in-out forwards;
      }

      @keyframes show {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
          transform: scaleX(var(--scale, 1));
        }
      }

      @keyframes hide {
        0% {
          opacity: 1;
          transform: none;
        }

        100% {
          opacity: 0;
          transform: none;
        }
      }

      ${CourierInboxToastItem.id}.clickable:last-child {
        cursor: pointer;
      }

      ${CourierInboxToastItem.id}.clickable:nth-last-child(n+2) {
        pointer-events: none;
      }
    `;

    // A dismiss icon is visible when the top toast item is in the :hover state.
    // Auto-dismiss styles are added, but unused if the auto-dismiss progress
    // bar  is not added in the courier-inbox-toast-item element
    // (i.e. when auto-dismiss is disabled).
    const dismissStyles = `
      ${CourierInboxToastItem.id} > .dismiss {
        position: absolute;
        visibility: hidden;
        opacity: 0%;
        top: -10px;
        right: -10px;
        background-color: ${item?.backgroundColor};
        border: ${item?.border};
        padding: 3px;
        border-radius: 50%;
        font-size: 12pt;
        box-shadow: ${item?.shadow};
        cursor: pointer;
        transition: 0.2s ease-in-out;
      }

      ${CourierInboxToastItem.id}${this._autoDismiss ? ':hover' : ''}:last-child > .dismiss {
        visibility: visible;
        opacity: 100%;
        transition: 0.2s ease-in-out;
      }

      ${CourierInboxToastItem.id} > .overflow-hidden-container > .auto-dismiss {
        width: 100%;
        height: 5px;
        background-color: ${item?.autoDismissColor};
        animation: auto-dismiss ${this._autoDismissTimeoutMs}ms ease-in-out forwards;
      }

      @keyframes auto-dismiss {
        100% {
          width: 0px;
        }
      }
    `;

    // Styles for the text and icon content.
    const contentStyles = `
      ${CourierInboxToastItem.id} > .overflow-hidden-container > .content {
        display: flex;
        gap: 12px;
        align-items: center;
        align-self: stretch;
        box-sizing: border-box;
        padding: 16px;
      }

      ${CourierInboxToastItem.id} > .overflow-hidden-container > .content > .text-content {
        line-height: 150%;
      }

      ${CourierInboxToastItem.id} > .overflow-hidden-container > .content > .icon {
      }

      ${CourierInboxToastItem.id} > .overflow-hidden-container > .content > .text-content > .title {
        margin: 0;
        font-weight: ${item?.title?.weight};
        font-size: ${item?.title?.size};
        color: ${item?.title?.color};
      }

      ${CourierInboxToastItem.id} > .overflow-hidden-container > .content > .text-content > .body {
        margin: 0;
        font-weight: ${item?.body?.weight};
        font-size: ${item?.body?.size};
        color: ${item?.body?.color};
      }
    `;

    return [
      toastStyles,
      toastStackStyles,
      toastItemStyles,
      dismissStyles,
      contentStyles,
    ].join('');
  }

  /** Get the top item's (i.e. the visible item's) height. */
  private get topStackItemHeight(): string {
    if (this.lastChild) {
      const height = (this.lastChild as HTMLDivElement).getBoundingClientRect().height;
      return `${height}px`;
    }

    return '0px';
  }

  /** @override */
  static get id() {
    return 'courier-inbox-toast';
  }
}

registerElement(CourierInboxToast);
