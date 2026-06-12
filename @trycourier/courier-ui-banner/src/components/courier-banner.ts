import { CourierBaseElement, CourierComponentThemeMode, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierBannerThemeManager, CourierBannerThemeSubscription } from "../types/courier-banner-theme-manager";
import { CourierBannerTheme, defaultLightTheme } from "../types/courier-banner-theme";
import { AuthenticationListener, Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierBannerItem } from "./courier-banner-item";
import {
  CourierBannerDismissButtonOption,
  CourierBannerItemActionClickEvent,
  CourierBannerItemClickEvent,
  CourierBannerItemDismissedEvent,
  CourierBannerItemFactoryProps,
  CourierBannerLayout,
  CourierBannerPosition,
} from "../types/banner";
import { CourierBannerDatastoreListener } from "../datastore/banner-datastore-listener";
import { CourierBannerDatastore } from "../datastore/banner-datastore";

/**
 * An embeddable and customizable banner component, fed by data from Courier Inbox.
 *
 * Drop the element where banners should appear. With the default `banner` layout, banners
 * render inline at the element's location (most teams place it at the top of the page). The
 * `popup` layout renders an overlay card anchored via {@link CourierBanner.setPosition}, and
 * the `custom` layout defers entirely to a factory / render prop.
 *
 * A single banner is visible at a time by default ({@link CourierBanner.setMaxVisible}), with
 * additional messages queued FIFO behind it.
 *
 * @example
 *
 * Embedding the default banner component on a webpage.
 * ```
 * <html>
 * <body>
 * <courier-banner></courier-banner>
 *
 * <script type="module">
 * import { Courier } from "@trycourier/courier-ui-banner";
 *
 * // Authenticate the user
 * Courier.shared.signIn({ userId, jwt });
 * </script>
 * </body>
 * </html>
 * ```
 *
 * @public
 */
export class CourierBanner extends CourierBaseElement {

  // Internally-maintained state
  private _themeManager: CourierBannerThemeManager;
  private _themeSubscription: CourierBannerThemeSubscription;
  private _bannerStyle?: HTMLStyleElement;
  private _authListener?: AuthenticationListener;
  private _datastoreListener: CourierBannerDatastoreListener;

  // Local FIFO mirror of the datastore's messages.
  private _messages: InboxMessage[] = [];
  // Rendered DOM nodes keyed by messageId.
  private _renderedItems: Map<string, HTMLElement> = new Map();
  // Overlay element used by the `popup` layout.
  private _overlay?: HTMLElement;

  // Consumer-provided options
  private _layout: CourierBannerLayout = 'banner';
  private _position: CourierBannerPosition = 'center';
  private _dismissButtonOption: CourierBannerDismissButtonOption = 'auto';
  private _dismissible: boolean = true;
  private _requireAction: boolean = false;
  private _maxVisible: number = 1;
  private _autoDismiss: boolean = false;
  private _autoDismissTimeoutMs: number = 5000;
  private _customBannerItem?: (props: CourierBannerItemFactoryProps) => HTMLElement;
  private _customBannerItemContent?: (props: CourierBannerItemFactoryProps) => HTMLElement;

  // Consumer-provided callbacks
  private _onItemClick?: ((props: CourierBannerItemClickEvent) => void);
  private _onItemActionClick?: ((props: CourierBannerItemActionClickEvent) => void);
  private _onItemDismissed?: ((props: CourierBannerItemDismissedEvent) => void);

  /**
   * The names of all attributes for which the web component needs change notifications.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes
   */
  static observedAttributes = [
    'layout',
    'position',
    'dismiss-button',
    'dismissible',
    'require-action',
    'max-visible',
    'auto-dismiss',
    'auto-dismiss-timeout-ms',
    'light-theme',
    'dark-theme',
    'mode',
  ];

  constructor(props?: {
    themeManager?: CourierBannerThemeManager
  }) {
    super();

    this._themeManager = props?.themeManager ?? new CourierBannerThemeManager(defaultLightTheme);
    this._themeSubscription = this._themeManager.subscribe((_: CourierBannerTheme) => {
      this.refreshStyles();
    });
    this._datastoreListener = new CourierBannerDatastoreListener({
      onMessageAdd: this.datastoreAddMessageListener.bind(this),
      onMessageRemove: this.datastoreRemoveMessageListener.bind(this),
    });
  }

  /** Set the handler invoked when a banner item is clicked. */
  public onBannerItemClick(handler?: (props: CourierBannerItemClickEvent) => void): void {
    this._onItemClick = handler;
  }

  /** Set the handler invoked when a banner item action button is clicked. */
  public onBannerItemActionClick(handler?: (props: CourierBannerItemActionClickEvent) => void): void {
    this._onItemActionClick = handler;
  }

  /** Set the handler invoked when a banner item is dismissed. */
  public onBannerItemDismissed(handler?: (props: CourierBannerItemDismissedEvent) => void): void {
    this._onItemDismissed = handler;
  }

  /** Enable auto-dismiss for banner items. */
  public enableAutoDismiss() {
    this._autoDismiss = true;
  }

  /** Disable auto-dismiss for banner items. */
  public disableAutoDismiss() {
    this._autoDismiss = false;
  }

  /**
   * Set the timeout before auto-dismissing banners.
   * Only applicable if auto-dismiss is enabled.
   * @param timeoutMs - The timeout in milliseconds before a banner is dismissed.
   */
  public setAutoDismissTimeoutMs(timeoutMs: number) {
    this._autoDismissTimeoutMs = timeoutMs;
  }

  /** Set the light theme for the banner. */
  public setLightTheme(theme: CourierBannerTheme) {
    this._themeManager.setLightTheme(theme);
  }

  /** Set the dark theme for the banner. */
  public setDarkTheme(theme: CourierBannerTheme) {
    this._themeManager.setDarkTheme(theme);
  }

  /**
   * Set the dismiss button display option.
   *
   * @param option - a value of {@link CourierBannerDismissButtonOption}
   */
  public setDismissButton(option: CourierBannerDismissButtonOption) {
    this._dismissButtonOption = option;
    this.refreshStyles();
  }

  /**
   * Set the theme mode.
   *
   * @param mode - The theme mode, one of "dark", "light", or "system".
   */
  public setMode(mode: CourierComponentThemeMode) {
    this._themeManager.setMode(mode);
  }

  /**
   * Set the layout used to present banners.
   *
   * @param layout - one of {@link CourierBannerLayout}
   */
  public setLayout(layout: CourierBannerLayout) {
    if (layout === this._layout) {
      return;
    }
    this._layout = layout;
    this.clearRendered();
    this.refreshStyles();
    this.render();
  }

  /**
   * Set the anchor position for the `popup` layout.
   *
   * @param position - one of {@link CourierBannerPosition}
   */
  public setPosition(position: CourierBannerPosition) {
    this._position = position;
    this.refreshStyles();
  }

  /**
   * Set whether banners can be dismissed by the user.
   *
   * When `false`, the dismiss button is hidden and (for the `popup` layout) clicking the
   * backdrop will not close the banner. Use together with {@link CourierBanner.setRequireAction}
   * to gate the user on an action (e.g. an "Accept" terms-of-use flow).
   */
  public setDismissible(dismissible: boolean) {
    this._dismissible = dismissible;
    this.refreshStyles();
  }

  /**
   * Set whether the banner requires an action click to be dismissed.
   *
   * When `true` (with the `popup` layout), clicking the backdrop will not close the banner.
   */
  public setRequireAction(requireAction: boolean) {
    this._requireAction = requireAction;
  }

  /**
   * Set the maximum number of banners visible at once. Additional messages are queued FIFO.
   * Defaults to 1.
   */
  public setMaxVisible(maxVisible: number) {
    this._maxVisible = Math.max(1, Math.floor(maxVisible));
    this.render();
  }

  /**
   * Set a factory function that renders an entire banner item. When set, the theme is not
   * applied to the item — the factory owns all styling.
   *
   * See {@link CourierBanner.setBannerItemContent} to set the content while preserving the
   * themed banner item container.
   */
  public setBannerItem(factory?: (props: CourierBannerItemFactoryProps) => HTMLElement) {
    this._customBannerItem = factory;
  }

  /**
   * Set a factory function that renders a banner item's content, preserving the themed
   * banner item container and its events.
   */
  public setBannerItemContent(factory?: (props: CourierBannerItemFactoryProps) => HTMLElement) {
    this._customBannerItemContent = factory;
  }

  /** @override */
  protected onComponentMounted(): void {
    this._bannerStyle = injectGlobalStyle(CourierBanner.id, this.getStyles(this.theme));

    CourierBannerDatastore.shared.addDatastoreListener(this._datastoreListener);
    this._authListener = Courier.shared.addAuthenticationListener(this.authChangedCallback.bind(this));
    CourierBannerDatastore.shared.listenForMessages();
  }

  /** @override */
  protected onComponentUnmounted(): void {
    this._datastoreListener.remove();
    this._authListener?.remove();
    this._bannerStyle?.remove();
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
      case 'layout':
        if (newValue && CourierBanner.isLayout(newValue)) {
          this.setLayout(newValue);
        }
        break;
      case 'position':
        if (newValue) {
          this.setPosition(newValue as CourierBannerPosition);
        }
        break;
      case 'dismiss-button':
        if (newValue && CourierBanner.isDismissButtonOption(newValue)) {
          this.setDismissButton(newValue);
        } else {
          this.setDismissButton('auto');
        }
        break;
      case 'dismissible':
        this.setDismissible(newValue !== 'false');
        break;
      case 'require-action':
        this.setRequireAction(newValue === 'true' || newValue === '');
        break;
      case 'max-visible':
        this.setMaxVisible(parseInt(newValue, /* base= */ 10));
        break;
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

  private get theme(): CourierBannerTheme {
    return this._themeManager.getTheme();
  }

  /** Refresh the styles tag, if it exists, with the current theme. */
  private refreshStyles() {
    if (this._bannerStyle) {
      this._bannerStyle.textContent = this.getStyles(this.theme);
    }
  }

  private authChangedCallback() {
    this._messages = [];
    this.clearRendered();

    // If re-auth'ing logged the user out and closed the WebSocket connection,
    // we'll open a new connection. If one is already open, this is a no-op.
    CourierBannerDatastore.shared.listenForMessages();
  }

  private datastoreAddMessageListener(message: InboxMessage) {
    this._messages.push(message);
    this.render();
  }

  private datastoreRemoveMessageListener(message: InboxMessage) {
    const index = this._messages.findIndex(m => m.messageId === message.messageId);
    if (index >= 0) {
      this._messages.splice(index, 1);
    }
    this.render();
  }

  /** Remove all rendered DOM, including the popup overlay. */
  private clearRendered() {
    this._renderedItems.forEach(node => node.remove());
    this._renderedItems.clear();
    this.removeOverlay();
  }

  /**
   * Diff the visible message slice against what's currently rendered, adding and removing
   * only what changed so persisting items don't re-animate.
   */
  private render() {
    const visible = this._messages.slice(0, this._maxVisible);
    const visibleIds = new Set(visible.map(m => m.messageId));

    // Remove items that are no longer visible.
    Array.from(this._renderedItems.entries()).forEach(([id, node]) => {
      if (!visibleIds.has(id)) {
        node.remove();
        this._renderedItems.delete(id);
      }
    });

    // Ensure the overlay exists (popup) or is removed (other layouts / empty).
    if (this._layout === 'popup' && visible.length > 0) {
      this.ensureOverlay();
    } else {
      this.removeOverlay();
    }

    const mountPoint: HTMLElement = (this._layout === 'popup' && this._overlay) ? this._overlay : this;

    // Add newly-visible items.
    visible.forEach(message => {
      if (this._renderedItems.has(message.messageId)) {
        return;
      }
      const node = this.createItem(message);
      node.dataset.courierMessageId = message.messageId;
      mountPoint.appendChild(node);
      this._renderedItems.set(message.messageId, node);
    });
  }

  private ensureOverlay() {
    if (this._overlay) {
      return;
    }
    const overlay = document.createElement('div');
    overlay.classList.add('courier-banner-overlay');
    overlay.addEventListener('click', this.onOverlayClick);
    this.appendChild(overlay);
    this._overlay = overlay;
  }

  private removeOverlay() {
    if (!this._overlay) {
      return;
    }
    this._overlay.removeEventListener('click', this.onOverlayClick);
    this._overlay.remove();
    this._overlay = undefined;
  }

  private onOverlayClick = (event: MouseEvent) => {
    // Only the backdrop (not the card) closes the popup, and only when allowed.
    if (event.target !== this._overlay) {
      return;
    }
    if (!this._dismissible || this._requireAction) {
      return;
    }
    const top = this._messages[0];
    if (top) {
      this.dismissMessage(top);
    }
  };

  private createItem(message: InboxMessage): HTMLElement {
    if (this._customBannerItem) {
      return this.createCustomItem(message);
    }
    return this.createDefaultItem(message);
  }

  private createDefaultItem(message: InboxMessage): CourierBannerItem {
    const item = new CourierBannerItem({
      message,
      layout: this._layout,
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
      themeManager: this._themeManager,
    });

    item.onItemDismissed(() => this.handleDismiss(message));

    if (this._customBannerItemContent) {
      item.setBannerItemContent(this._customBannerItemContent);
    }
    if (this._onItemClick) {
      item.onBannerItemClick(this._onItemClick);
    }
    if (this._onItemActionClick) {
      item.onBannerItemActionClick(this._onItemActionClick);
    }
    if (this._autoDismiss) {
      setTimeout(() => item.dismiss(), this._autoDismissTimeoutMs);
    }

    return item;
  }

  private createCustomItem(message: InboxMessage): HTMLElement {
    if (!this._customBannerItem) {
      throw Error("Attempted to create a custom banner item, but none is set");
    }

    const customItem = this._customBannerItem({
      message,
      layout: this._layout,
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
      dismiss: () => this.handleDismiss(message),
    });

    customItem.addEventListener('click', () => {
      this._onItemClick?.({ message });
    });

    if (this._autoDismiss) {
      setTimeout(() => this.handleDismiss(message), this._autoDismissTimeoutMs);
    }

    return customItem;
  }

  /** Animate-and-dismiss the rendered node for a message, falling back to immediate removal. */
  private dismissMessage(message: InboxMessage) {
    const node = this._renderedItems.get(message.messageId);
    if (node instanceof CourierBannerItem) {
      node.dismiss();
    } else {
      this.handleDismiss(message);
    }
  }

  /** Single source of truth for removing a dismissed message and notifying listeners. */
  private handleDismiss(message: InboxMessage) {
    this._renderedItems.delete(message.messageId);
    this._onItemDismissed?.({ message });
    CourierBannerDatastore.shared.removeMessage(message);
  }

  /** Whether the dismiss button should only be shown on hover. */
  private get showDismissOnHover(): boolean {
    if (this._autoDismiss && this._dismissButtonOption === 'auto') {
      return true;
    }
    return this._dismissButtonOption === 'hover';
  }

  /** Whether to show the dismiss button at all. */
  private get showDismiss(): boolean {
    return this._dismissible && this._dismissButtonOption !== 'hidden';
  }

  private getStyles(theme: CourierBannerTheme): string {
    const item = theme.item;
    const popup = theme.popup;

    const itemContainerStyles = this._layout === 'custom' ? '' : `
      ${CourierBannerItem.id} {
        display: block;
        box-sizing: border-box;
        width: 100%;
        background-color: ${item?.backgroundColor};
        box-shadow: ${item?.shadow};
        border: ${item?.border};
        border-radius: ${item?.borderRadius};
        animation: courier-banner-show 0.25s ease-out;
      }

      ${CourierBannerItem.id}.dismissing {
        animation: courier-banner-hide 0.2s ease-in forwards;
      }

      @keyframes courier-banner-show {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: none; }
      }

      @keyframes courier-banner-hide {
        from { opacity: 1; transform: none; }
        to { opacity: 0; transform: translateY(-8px); }
      }

      ${CourierBannerItem.id}.clickable { cursor: pointer; }

      ${CourierBannerItem.id}.clickable:hover {
        background-color: ${item?.hoverBackgroundColor};
      }

      ${CourierBannerItem.id}.clickable:active {
        background-color: ${item?.activeBackgroundColor};
      }

      ${CourierBannerItem.id} .content {
        display: flex;
        gap: 12px;
        align-items: center;
        box-sizing: border-box;
        padding: 12px 16px;
      }

      ${CourierBannerItem.id} .icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
      }

      ${CourierBannerItem.id} .text-content {
        flex: 1;
        min-width: 0;
      }

      ${CourierBannerItem.id} .title {
        margin: 0;
        font-weight: ${item?.title?.weight};
        font-size: ${item?.title?.size};
        color: ${item?.title?.color};
      }

      ${CourierBannerItem.id} .body {
        margin: 4px 0 0 0;
        font-weight: ${item?.body?.weight};
        font-size: ${item?.body?.size};
        line-height: 150%;
        color: ${item?.body?.color};
      }

      ${CourierBannerItem.id} .actions-container {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      ${CourierBannerItem.id} .dismiss {
        flex-shrink: 0;
        margin-left: auto;
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: ${this.showDismiss ? (this.showDismissOnHover ? 'none' : 'block') : 'none'};
      }

      ${CourierBannerItem.id}:hover .dismiss {
        display: ${this.showDismiss ? 'block' : 'none'};
      }
    `;

    return [
      this.getLayoutStyles(popup),
      itemContainerStyles,
    ].join('');
  }

  private getLayoutStyles(popup: CourierBannerTheme['popup']): string {
    switch (this._layout) {
      case 'popup': {
        const { alignItems, justifyContent } = CourierBanner.positionToFlex(this._position);
        return `
          ${CourierBanner.id} { display: block; }

          ${CourierBanner.id} .courier-banner-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            box-sizing: border-box;
            padding: 24px;
            background-color: ${popup?.overlayColor};
            align-items: ${alignItems};
            justify-content: ${justifyContent};
          }

          ${CourierBanner.id} .courier-banner-overlay > ${CourierBannerItem.id} {
            max-width: ${popup?.maxWidth};
          }
        `;
      }
      case 'custom':
        return `${CourierBanner.id} { display: block; width: 100%; }`;
      case 'banner':
      default:
        return `${CourierBanner.id} { display: block; width: 100%; }`;
    }
  }

  /** @override */
  static get id() {
    return 'courier-banner';
  }

  private static positionToFlex(position: CourierBannerPosition): { alignItems: string; justifyContent: string } {
    const vertical = position.startsWith('top') ? 'flex-start' : position.startsWith('bottom') ? 'flex-end' : 'center';
    const horizontal = position.endsWith('left') ? 'flex-start' : position.endsWith('right') ? 'flex-end' : 'center';
    return { alignItems: vertical, justifyContent: horizontal };
  }

  private static isLayout(value: string): value is CourierBannerLayout {
    return (['banner', 'popup', 'custom'] as CourierBannerLayout[]).includes(value as CourierBannerLayout);
  }

  private static isDismissButtonOption(value: string): value is CourierBannerDismissButtonOption {
    return (['visible', 'hidden', 'hover', 'auto'] as CourierBannerDismissButtonOption[]).includes(value as CourierBannerDismissButtonOption);
  }
}

registerElement(CourierBanner);
