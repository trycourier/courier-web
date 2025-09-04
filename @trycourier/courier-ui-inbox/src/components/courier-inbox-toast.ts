import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme, defaultLightTheme } from "../types/courier-inbox-theme";
import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxToastItem } from "./courier-inbox-toast-item";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxFeedType } from "../types/feed-type";

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

  private _defaultProps = {
    width: '380px',
    height: '100px',
    top: '30px',
    right: '30px',
  };

  static observedAttributes = ['auto-dismiss', 'auto-dismiss-timeout-ms'];

  constructor(props: {
    themeManager?: CourierInboxThemeManager
  }) {
    super();

    this._themeManager = props?.themeManager ?? new CourierInboxThemeManager(defaultLightTheme);
    this._themeSubscription = this._themeManager.subscribe((_: CourierInboxTheme) => {
      // this.render();
    });
  }

  /**
   * Add an {@link InboxMessage} toast.
   *
   * <p>Useful to send test messages while developing with the Courier SDK.</p>
   *
   * <p>Example:</p>
   * <pre>
   * const toast = document.getElementById("my-toast");
   *
   * toast.addInboxMessage({
   *  title: 'Lorem ipsum dolor sit',
   *  body: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
   *  messageId: '1'
   * });
   * </pre>
   */
  public addInboxMessage(message: InboxMessage) {
    this.addItem(message);
  }

  /** @override */
  protected onComponentMounted(): void {
    this._toastStyle = injectGlobalStyle(CourierInboxToast.id, this.getStyles(this.theme));

    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);
    Courier.shared.addAuthenticationListener(this.authChangedCallback.bind(this));
  }

  /** @override */
  protected onComponentUnmounted(): void {
    this._datastoreListener.remove();
    this._authListener?.remove();
    this._toastStyle?.remove();
    this._themeManager.cleanup();
  }

  /** @override */
  protected attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case 'auto-dismiss':
        this._autoDismiss = newValue !== 'false';
        break;
      case 'auto-dismiss-timeout-ms':
        this._autoDismissTimeoutMs = parseInt(newValue, /* base= */ 10);
        break;
    }
  }

  get theme(): CourierInboxTheme {
    return this._themeManager.getTheme();
  }

  private authChangedCallback() {
    this.removeAllItems();
    CourierInboxDatastore.shared.listenForUpdates();
  }

  private removeAllItems(): void {
    while (this.firstChild) {
      this.firstChild.remove();
    }
  }

  private addItem(message: InboxMessage) {
    const stack = this;
    const item = new CourierInboxToastItem({
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
      themeManager: this._themeManager
    });
    item.setMessage(message);
    item.setOnItemDismiss((_) => {
      item.remove();
      stack.style.height = this.topStackItemHeight;
    });
    this.appendChild(item);
    this.style.height = this.topStackItemHeight;
  }

  private datastoreAddMessageListener(message: InboxMessage, _: number, feedType: CourierInboxFeedType) {
    if (feedType !== 'inbox') {
      return;
    }

    this.addItem(message);
  }

  private getStyles(theme: CourierInboxTheme): string {
    const item = theme.toast?.item;

    return `
      ${CourierInboxToast.id} {
        position: fixed;
        z-index: 999;
        top: ${this._defaultProps.top};
        right: ${this._defaultProps.right};
        width: ${this._defaultProps.width};
        height: ${this._defaultProps.height};
      }

      ${CourierInboxToastItem.id}:last-child {
        top: 0;
        right: 0;
      }

      ${CourierInboxToastItem.id}:nth-last-child(2) {
        top: 12px;
        bottom: -12px;
        right: 12px;
        width: calc(100% - 24px);
      }

      ${CourierInboxToastItem.id}:nth-last-child(3) {
        top: 24px;
        bottom: -24px;
        right: 24px;
        width: calc(100% - 48px);
      }

      ${CourierInboxToastItem.id}:nth-last-child(n+4) {
        top: 24px;
        bottom: -24px;
        right: 24px;
        width: calc(100% - 48px);
        visibility: hidden;
      }

      ${CourierInboxToastItem.id}:nth-last-child(n+2) > .content > .text-content > .title,
      ${CourierInboxToastItem.id}:nth-last-child(n+2) > .content > .text-content > .body {
        color: rgba(255, 255, 255, 0);
      }

      ${CourierInboxToastItem.id} {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        background-color: ${item?.backgroundColor};
        box-shadow: ${item?.shadow};
        border: ${item?.border};
        border-radius: ${item?.borderRadius};
        transition: 0.2s ease-in-out;
        ${this._autoDismiss ? 'overflow: hidden;' : ''}

        opacity: 0;
        transform: translate(0, -10px);
        animation: show 0.3s ease-in-out forwards;
      }

      ${CourierInboxToastItem.id}.dismissing {
        animation: hide 0.3s ease-in-out forwards;
      }

      ${CourierInboxToastItem.id} > .content > .dismiss {
        position: absolute;
        visibility: hidden;
        opacity: 0%;
        top: -10px;
        right: -10px;
        background-color: #fff;
        padding: 3px;
        border-radius: 50%;
        font-size: 12pt;
        color: rgb(65, 65, 65);
        box-shadow: 0px 2px 5px lightgrey;
        cursor: pointer;
        transition: 0.2s ease-in-out;
      }

      ${CourierInboxToastItem.id}:last-child:hover > .content > .dismiss {
        visibility: visible;
        opacity: 100%;
        transition: 0.2s ease-in-out;
      }

      ${CourierInboxToastItem.id} > .auto-dismiss {
        width: 100%;
        height: 5px;
        background-color: ${item?.autoDismissColor};
        animation: auto-dismiss ${this._autoDismissTimeoutMs}ms ease-in-out forwards;
      }

      ${CourierInboxToastItem.id} > .content {
        display: flex;
        gap: 12px;
        align-items: center;
        align-self: stretch;
        box-sizing: border-box;
        padding: 16px;
      }

      ${CourierInboxToastItem.id} > .content > .text-content {
        line-height: 150%;
      }

      ${CourierInboxToastItem.id} > .content > .icon {
      }

      ${CourierInboxToastItem.id} > .content > .text-content > .title {
        margin: 0;
        font-weight: ${item?.title?.weight};
        font-size: ${item?.title?.size};
        color: ${item?.title?.color};
      }

      ${CourierInboxToastItem.id} > .content > .text-content > .body {
        margin: 0;
        font-weight: ${item?.body?.weight};
        font-size: ${item?.body?.size};
        color: ${item?.body?.color};
      }

      @keyframes show {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
          transform: none;
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

      @keyframes auto-dismiss {
        100% {
          width: 0px;
        }
      }
    `;
  }

  /** Get the top item's (i.e. the visible item's) height. */
  get topStackItemHeight(): string {
    const height = (this.lastChild as HTMLDivElement).getBoundingClientRect().height;
    return `${height}px`;
  }

  /** @override */
  static get id() {
    return 'courier-inbox-toast';
  }
}

registerElement(CourierInboxToast);
