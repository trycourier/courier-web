import { CourierBaseElement, CourierIcon, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { InboxMessage } from "@trycourier/courier-js";
import { CourierToastItemClickEvent, CourierToastItemDismissedEvent, CourierToastItemFactoryProps } from "../types/toast";

export class CourierToastItem extends CourierBaseElement {
  /** The animation duration to fade out a dismissed toast before its element is removed. */
  private static readonly dismissAnimationTimeoutMs = 300;

  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;
  private _message?: InboxMessage;
  private _customToastItemContent?: (props: CourierToastItemFactoryProps | undefined | null) => HTMLElement;

  /** Whether this toast item is auto-dismissed. */
  private readonly _autoDismiss: boolean;

  /** The timeout before the toast item is auto-dismissed, applicable if _autoDismiss is true. */
  private readonly _autoDismissTimeoutMs?: number;

  // Callbacks
  private onItemDismissCallback: ((props: CourierToastItemDismissedEvent) => void) | null = null;
  private onItemClickCallback: ((props: CourierToastItemClickEvent) => void) | null = null;

  constructor(props: {
    autoDismiss: boolean,
    autoDismissTimeoutMs?: number,
    themeManager: CourierInboxThemeManager,
  }) {

    super();
    this._autoDismiss = props.autoDismiss;
    this._autoDismissTimeoutMs = props.autoDismissTimeoutMs;

    this._themeManager = props.themeManager;
    this._themeSubscription = this._themeManager.subscribe((_: CourierInboxTheme) => {
      this.render();
    });
  }

  /**
   * Set the message for this toast item.
   *
   * @param message The {@link InboxMessage} to render in this toast item.
   */
  public setMessage(message: InboxMessage) {
    this._message = message;
    this.render();
  }

  /**
   * Registers a handler called when the item is dismissed.
   *
   * @param handler A function to be called when the item is dismissed.
   */
  public onItemDismissed(handler: (props: CourierToastItemDismissedEvent) => void): void {
    this.onItemDismissCallback = handler;
  }

  /**
   * Registers a handler for item click events.
   *
   * @param handler A function to be called when the item is clicked.
   */
  public onItemClicked(handler: (props: CourierToastItemClickEvent) => void): void {
    this.onItemClickCallback = handler;
  }

  /**
   * Set a custom content element for the toast item, reusing the {@link CourierToastItem}
   * container, which provides styling, animations, and event handling.
   *
   * @param factory Function that returns an {@link HTMLElement} to render as the content.
   */
  public setToastItemContent(factory: (props: CourierToastItemFactoryProps | undefined | null) => HTMLElement) {
    this._customToastItemContent = factory;
  }

  /**
   * Dismiss the toast item.
   *
   * <p>By default the toast fades out before it's removed. Set {@param timeoutMs} to
   * `0` to remove the item immediately.
   *
   * @param timeoutMs the animation duration to fade out the toast item
   */
  public dismiss(timeoutMs: number = CourierToastItem.dismissAnimationTimeoutMs) {
    this.classList.add('dismissing');
    setTimeout(this.remove.bind(this), timeoutMs);

    if (this._message && this.onItemDismissCallback) {
      this.onItemDismissCallback({ message: this._message });
    }
  }

  /** @override */
  protected onComponentMounted(): void {
    this.render();
  }

  /** @override */
  protected onComponentUnmounted(): void {
    this._themeSubscription.unsubscribe();
  }

  get theme(): CourierInboxTheme {
    return this._themeManager.getTheme();
  }

  /**
   * @override
   */
  static get id(): string {
    return 'courier-toast-item';
  }

  /**
   * @override
   */
  static get observedAttributes(): string[] {
    return [];
  }

  /**
   * Render a toast item, either with default content or custom content if
   * a content factory function is provided.
   *
   * Note: Styles for the toast item are set in {@link CourierToast} since
   * toasts are ephemeral by nature and we want to avoid adding/removing/duplicating
   * styles as {@link CourierToastItem}s enter/exit.
   */
  private render(): void {
    // Reset existing content and top-level listeners
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.removeEventListener('click', this.onClick);

    if (!this._message) {
      return;
    }

    // Content and the auto-dismiss bar are wrapped in a container that hides overflow.
    // The standard dismiss button overflows the toast.
    const overflowHiddenContainer = document.createElement('div');
    overflowHiddenContainer.classList.add('overflow-hidden-container');
    this.appendChild(overflowHiddenContainer);

    // Auto-dismiss
    if (this._autoDismiss) {
      const autoDismiss = document.createElement('div');
      autoDismiss.classList.add('auto-dismiss');
      overflowHiddenContainer.append(autoDismiss);

      setTimeout(this.dismiss.bind(this, CourierToastItem.dismissAnimationTimeoutMs), this._autoDismissTimeoutMs);
    }

    // Content
    if (this._customToastItemContent) {
      overflowHiddenContainer.appendChild(this._customToastItemContent({ message: this._message }));
    } else {
      overflowHiddenContainer.appendChild(this.createDefaultContent());
    }

    // Click-ability
    if (this.onItemClickCallback) {
      this.classList.add('clickable');
    }

    this.addEventListener('click', this.onClick);

    // Dismiss button
    const dismiss = new CourierIcon(
      this.theme.toast?.item?.dismissIcon?.color,
      this.theme.toast?.item?.dismissIcon?.svg,
    );
    dismiss.classList.add('dismiss');
    dismiss.addEventListener('click', (event) => {
      event.stopPropagation();
      this.remove();

      if (this._message && this.onItemDismissCallback) {
        this.onItemDismissCallback({ message: this._message });
      }
    });
    this.appendChild(dismiss);
  }

  /** Create the default content for this item. */
  private createDefaultContent(): HTMLElement {
    const content = document.createElement('div');
    content.classList.add('content');
    this.append(content);

    const icon = new CourierIcon(
      this.theme.toast?.item?.icon?.color,
      this.theme.toast?.item?.icon?.svg,
    );
    icon.classList.add('icon');
    content.appendChild(icon);

    const textContent = document.createElement('div');
    textContent.classList.add('text-content');
    content.appendChild(textContent);

    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = this._message?.title ?? '';
    textContent.appendChild(title);

    const body = document.createElement('p');
    body.classList.add('body');
    body.textContent = this._message?.preview ?? this._message?.body ?? '';
    textContent.appendChild(body);
    return content;
  }

  private onClick(event: Event) {
    event.stopPropagation();
    if (this._message && this.onItemClickCallback) {
      this.onItemClickCallback({ toastItem: this, message: this._message });
    }
  }
}

registerElement(CourierToastItem);
