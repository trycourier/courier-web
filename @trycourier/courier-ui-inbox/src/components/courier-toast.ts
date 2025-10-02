import { CourierBaseElement, CourierComponentThemeMode, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme, defaultLightTheme } from "../types/courier-inbox-theme";
import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierToastItem } from "./courier-toast-item";
import { CourierToastItemClickEvent, CourierToastItemFactoryProps } from "../types/toast";
import { CourierToastDismissButtonOption } from "../types/toast";
import { CourierToastDatastoreListener } from "../datastore/toast-datastore-listener";
import { CourierToastDatastore } from "../datastore/toast-datastore";

/** Default set of CSS properties used to layout CourierToast. */
type CourierToastLayoutProps = {
  position?: string;
  width?: string;
  top?: string;
  right?: string;
  zIndex?: number;
}

/**
 * An embeddable and customizable toast component, fed by data from Courier Inbox.
 *
 * @example
 *
 * Embedding the default toast component on a webpage.
 * ```
 * <html>
 * <body>
 * <courier-toast></courier-toast>
 *
 * <script type="module">
 * import { Courier } from "@trycourier/courier-ui-inbox";
 *
 * // Authenticate the user with the inbox
 * Courier.shared.signIn({ userId, jwt });
 * </script>
 * </body>
 * </html>
 * ```
 */
export class CourierToast extends CourierBaseElement {

  // Internally-maintained state
  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;
  private _toastStyle?: HTMLStyleElement;
  private _authListener?: AuthenticationListener;
  private _datastoreListener: CourierToastDatastoreListener;

  // Consumer-provided options
  private _autoDismiss: boolean = false;
  private _autoDismissTimeoutMs: number = 5000;
  private _dismissButtonOption: CourierToastDismissButtonOption = 'auto';
  private _customToastItem?: (props: CourierToastItemFactoryProps) => HTMLElement;
  private _customToastItemContent?: (props: CourierToastItemFactoryProps) => HTMLElement;

  // Consumer-provided callbacks
  private _onItemClick?: ((props: CourierToastItemClickEvent) => void);

  /** Default layout props. */
  private readonly _defaultLayoutProps: CourierToastLayoutProps = {
    position: 'fixed',
    width: '380px',
    top: '30px',
    right: '30px',
    zIndex: 999,
  };

  /**
   * The names of all attributes for which the web component needs change notifications.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes
   */
  static observedAttributes = [
    'auto-dismiss',
    'auto-dismiss-timeout-ms',
    'dismiss-button',
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
    this._datastoreListener = new CourierToastDatastoreListener({
      onMessageAdd: this.datastoreAddMessageListener.bind(this),
      onMessageRemove: this.datastoreRemoveMessageListener.bind(this),
    });
  }

  /** Set the handler invoked when a toast item is clicked. */
  public onToastItemClick(handler?: (props: CourierToastItemClickEvent) => void): void {
    this._onItemClick = handler;
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
   * Set the dismiss button display option.
   *
   * @param option a value of {@link CourierToastDismissButtonOption}
   */
  public setDismissButton(option: CourierToastDismissButtonOption) {
    this._dismissButtonOption = option;
    this.refreshStyles();
  }

  /**
   * Set the theme mode.
   *
   * @param mode The theme mode, one of "dark", "light", or "system".
   */
  public setMode(mode: CourierComponentThemeMode) {
    this._themeManager.setMode(mode);
  }

  /**
   * Set a factory function that renders a toast item.
   *
   * See {@link setToastItemContent} to set the content while preserving the toast item's
   * container and stack styling.
   */
  public setToastItem(factory?: (props: CourierToastItemFactoryProps) => HTMLElement) {
    this._customToastItem = factory;
  }

  /**
   * Set a factory function that renders a toast item's content.
   *
   * The toast item's container, including the stack, auto-dismiss timer, and dismiss button
   * and all events are still present when custom content is set.
   *
   * See {@link setDismissButton} to customize the dismiss button's visibility and
   * {@link setToastItem} to customize the entire toast item, including
   * its container.
   */
  public setToastItemContent(factory?: (props: CourierToastItemFactoryProps) => HTMLElement) {
    this._customToastItemContent = factory;
  }

  /**
   * Dismiss the toast item(s) associated with a particular {@link InboxMessage}.
   *
   * Toast items are matched to messages by the field {@link InboxMessage.messageId}.
   * If the item is an instance of {@link CourierToastItem} it will be animated out
   * before removal, otherwise custom items are removed immediately.
   *
   * If there are multiple toast items matching the message, all items will be dismissed.
   *
   * @example
   * Using dismissToastForMessage with setToastItem to dismiss a custom element.
   * ```ts
   * // Get a reference to the toast component
   * const toast = document.getElementById("my-toast");
   *
   * toast.setToastItem((props) => {
   *   const el = document.createElement("div");
   *   el.addEventListener("click", () => toast.dismissToastForMessage(props.message));
   *   return el;
   * });
   * ```
   *
   * @param message the {@link InboxMessage} for which toast items should be dismissed
   */
  private dismissToastForMessage(message: InboxMessage) {
    this.childNodes.forEach(node => {
      const nodeMessageId = (node as HTMLElement).dataset.courierMessageId;

      if (nodeMessageId !== message.messageId) {
        return;
      }

      if (node instanceof CourierToastItem) {
        node.dismiss();
      } else {
        node.remove();
      }
    });
  }

  /**
   * @override
   * @inheritdoc
   */
  protected onComponentMounted(): void {
    this._toastStyle = injectGlobalStyle(CourierToast.id, this.getStyles(this.theme));

    CourierToastDatastore.shared.addDatastoreListener(this._datastoreListener);
    Courier.shared.addAuthenticationListener(this.authChangedCallback.bind(this));
    CourierToastDatastore.shared.listenForMessages();
  }

  /**
   * @override
   * @inheritdoc
   */
  protected onComponentUnmounted(): void {
    this._datastoreListener.remove();
    this._authListener?.remove();
    this._toastStyle?.remove();
    this._themeManager.cleanup();
    this._themeSubscription.unsubscribe();
  }

  /**
   * Lifecycle callback invoked when an observed attribute changes.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes
   */
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
      case 'dismiss-button':
        if (newValue && CourierToast.isDismissButtonOption(newValue)) {
          this.setDismissButton(newValue as CourierToastDismissButtonOption);
        } else {
          this.setDismissButton('auto');
        }
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

  /** Refresh the styles tag, if it exists, with the current theme. */
  private refreshStyles() {
    if (this._toastStyle) {
      this._toastStyle.textContent = this.getStyles(this.theme);
    }
  }

  private authChangedCallback() {
    this.removeAllItems();

    // If re-auth'ing logged the user out and closed the WebSocket connection,
    // we'll open a new connection. If one is already open, this is a no-op.
    CourierToastDatastore.shared.listenForMessages();
  }

  private removeAllItems(): void {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  private addToastItem(message: InboxMessage): CourierToastItem | HTMLElement {
    // Append the toast item and resize the toast container
    // so previous toast items can stack underneath at fixed offsets
    // from the top item.
    const toastItem = this.createToastItem(message);
    toastItem.dataset.courierMessageId = message.messageId;
    this.appendChild(toastItem);
    this.resizeContainerToHeight(this.topStackItemHeight);

    return toastItem;
  }

  private createToastItem(message: InboxMessage): CourierToastItem | HTMLElement {
    if (this._customToastItem) {
      return this.createCustomToastItem(message);
    }

    return this.createDefaultToastItem(message);
  }

  private createDefaultToastItem(message: InboxMessage) {
    const item = new CourierToastItem({
      message,
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
      themeManager: this._themeManager
    });

    item.onItemDismissed((_) => {
      this.resizeContainerToHeight(this.topStackItemHeight);
    });

    if (this._customToastItemContent) {
      item.setToastItemContent(this._customToastItemContent);
    }

    if (this._onItemClick) {
      item.onItemClicked(this._onItemClick);
    }

    if (this._autoDismiss) {
      setTimeout(item.dismiss.bind(item), this._autoDismissTimeoutMs);
    }

    return item;
  }

  private createCustomToastItem(message: InboxMessage) {
    if (!this._customToastItem) {
      throw Error("Attempted to create customToastItem, but none is set");
    }

    const customItem = this._customToastItem({
      message,
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
    });

    if (this._autoDismiss) {
      setTimeout(() => {
        this.removeChild(customItem);
      }, this._autoDismissTimeoutMs);
    }

    if (this._onItemClick) {
      customItem.addEventListener('click', this._onItemClick.bind(this, { message, toastItem: customItem }));
    }

    return customItem;
  }

  private datastoreAddMessageListener(message: InboxMessage) {
    this.addToastItem(message);
  }

  private datastoreRemoveMessageListener(message: InboxMessage) {
    this.dismissToastForMessage(message);
  }

  private getStyles(theme: CourierInboxTheme): string {
    const item = theme.toast?.item;

    // Styles for the top-level toast container.
    const toastStyles = `
      ${CourierToast.id} {
        position: ${this._defaultLayoutProps.position};
        z-index: ${this._defaultLayoutProps.zIndex};
        top: ${this._defaultLayoutProps.top};
        right: ${this._defaultLayoutProps.right};
        width: ${this._defaultLayoutProps.width};
      }
    `;

    // Stack the three most recently shown toast items and hide all others.
    // Content is transparent for all but the most recent (top) toast item
    // since it otherwise peeks out in the visible stack items.
    const toastStackStyles = `
      ${CourierToastItem.id}:last-child {
        top: 0;
        right: 0;
      }

      ${CourierToastItem.id}:nth-last-child(2) {
        top: 12px;
        bottom: -12px;
        --scale: 0.95
      }

      ${CourierToastItem.id}:nth-last-child(3) {
        top: 24px;
        bottom: -24px;
        --scale: 0.9;
      }

      ${CourierToastItem.id}:nth-last-child(n+4) {
        top: 24px;
        bottom: -24px;
        --scale: 0.9;
        visibility: hidden;
      }

      ${CourierToastItem.id}:nth-last-child(n+2) > .overflow-hidden-container > .content > .text-content > .title,
      ${CourierToastItem.id}:nth-last-child(n+2) > .overflow-hidden-container > .content > .text-content > .body {
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
      ${CourierToastItem.id} {
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

      ${CourierToastItem.id} > .overflow-hidden-container {
        height: 100%;
        width: 100%;
        border-radius: ${item?.borderRadius};
        overflow: hidden;
      }

      ${CourierToastItem.id}.dismissing {
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

      ${CourierToastItem.id}.clickable:last-child {
        cursor: pointer;
      }

      ${CourierToastItem.id}.clickable:nth-last-child(n+2) {
        pointer-events: none;
      }
    `;

    // A dismiss icon is visible when the top toast item is in the :hover state.
    // Auto-dismiss styles are added, but unused if the auto-dismiss progress
    // bar  is not added in the courier-toast-item element
    // (i.e. when auto-dismiss is disabled).
    const dismissStyles = `
      ${CourierToastItem.id} > .dismiss {
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

      ${CourierToastItem.id}:last-child${this.showDismissOnHover ? ':hover' : ''} > .dismiss {
        visibility: ${this.showDismiss ? 'visible' : 'hidden'};
        opacity: 100%;
        transition: 0.2s ease-in-out;
      }
    `;

    const autoDismissStyles = `
      ${CourierToastItem.id} > .overflow-hidden-container > .auto-dismiss {
        width: 100%;
        height: 5px;
        background-color: ${item?.autoDismissBarColor};
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
      ${CourierToastItem.id} > .overflow-hidden-container > .content {
        display: flex;
        gap: 12px;
        align-items: center;
        align-self: stretch;
        box-sizing: border-box;
        padding: 16px;
      }

      ${CourierToastItem.id} > .overflow-hidden-container > .content > .text-content {
        line-height: 150%;
      }

      ${CourierToastItem.id} > .overflow-hidden-container > .content > .icon {
      }

      ${CourierToastItem.id} > .overflow-hidden-container > .content > .text-content > .title {
        margin: 0;
        font-weight: ${item?.title?.weight};
        font-size: ${item?.title?.size};
        color: ${item?.title?.color};
      }

      ${CourierToastItem.id} > .overflow-hidden-container > .content > .text-content > .body {
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
      autoDismissStyles,
      contentStyles,
    ].join('');
  }

  /** Get the top item's (i.e. the fully visible item's) height. */
  private get topStackItemHeight(): string {
    if (this.lastChild) {
      const height = (this.lastChild as HTMLDivElement).getBoundingClientRect().height;
      return `${height}px`;
    }

    return '0px';
  }

  private resizeContainerToHeight(height: string) {
    this.style.height = height;
  }

  /** Whether the dismiss button should only be shown on hover. */
  private get showDismissOnHover(): boolean {
    // Auto-dismiss is enabled and button is using 'auto' behavior (show w/o auto-dismiss, show on hover w/ auto-dismiss).
    if (this._autoDismiss && this._dismissButtonOption === 'auto') {
      return true;
    }

    // Explicitly set to show on hover
    if (this._dismissButtonOption === 'hover') {
      return true;
    }

    return false;
  }

  /** Whether to show the dismiss button. The button is visible (either always or on hover) if not explicitly disabled. */
  private get showDismiss(): boolean {
    return this._dismissButtonOption !== 'hidden';
  }

  /** @override */
  static get id() {
    return 'courier-toast';
  }

  private static isDismissButtonOption(value: string): value is CourierToastDismissButtonOption {
    const validOptions: CourierToastDismissButtonOption[] = ['visible', 'hidden', 'hover', 'auto'];
    return validOptions.includes(value as CourierToastDismissButtonOption);
  }
}

registerElement(CourierToast);
