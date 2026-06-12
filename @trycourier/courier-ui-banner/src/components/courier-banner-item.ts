import { CourierBaseElement, CourierButton, CourierIcon, registerElement } from "@trycourier/courier-ui-core";
import { CourierBannerThemeManager, CourierBannerThemeSubscription } from "../types/courier-banner-theme-manager";
import { CourierBannerTheme } from "../types/courier-banner-theme";
import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import {
  CourierBannerItemActionClickEvent,
  CourierBannerItemClickEvent,
  CourierBannerItemFactoryProps,
  CourierBannerLayout,
} from "../types/banner";

/**
 * Default implementation of a Banner item.
 *
 * The container styles (positioning per layout, background, border, shadow) are provided by
 * the parent {@link CourierBanner} as an injected global stylesheet; this element only builds
 * the DOM structure and class names.
 *
 * @see {@link CourierBanner}
 * @public
 */
export class CourierBannerItem extends CourierBaseElement {
  /** The animation duration to fade out a dismissed banner before its element is removed. */
  private static readonly dismissAnimationTimeoutMs = 300;

  private _themeManager: CourierBannerThemeManager;
  private _themeSubscription: CourierBannerThemeSubscription;
  private _message: InboxMessage;
  private _layout: CourierBannerLayout;
  private _customBannerItemContent?: (props: CourierBannerItemFactoryProps) => HTMLElement;

  /** Whether this banner item is auto-dismissed. */
  private readonly _autoDismiss: boolean;

  /** The timeout before the banner item is auto-dismissed, applicable if _autoDismiss is true. */
  private readonly _autoDismissTimeoutMs: number;

  // Callbacks
  private _onItemDismissedCallback: ((props: { message: InboxMessage }) => void) | null = null;
  private _onBannerItemClickCallback: ((props: CourierBannerItemClickEvent) => void) | null = null;
  private _onBannerItemActionClickCallback: ((props: CourierBannerItemActionClickEvent) => void) | null = null;

  constructor(props: {
    message: InboxMessage,
    layout: CourierBannerLayout,
    autoDismiss: boolean,
    autoDismissTimeoutMs: number,
    themeManager: CourierBannerThemeManager,
  }) {
    super();
    this._message = props.message;
    this._layout = props.layout;
    this._autoDismiss = props.autoDismiss;
    this._autoDismissTimeoutMs = props.autoDismissTimeoutMs;

    this._themeManager = props.themeManager;
    this._themeSubscription = this._themeManager.subscribe((_: CourierBannerTheme) => {
      this.render();
    });
  }

  /**
   * Registers a handler called when the item is dismissed.
   *
   * @param handler - A function to be called when the item is dismissed.
   */
  public onItemDismissed(handler: (props: { message: InboxMessage }) => void): void {
    this._onItemDismissedCallback = handler;
  }

  /**
   * Registers a handler for item click events.
   *
   * @param handler - A function to be called when the item is clicked.
   */
  public onBannerItemClick(handler: (props: CourierBannerItemClickEvent) => void): void {
    this._onBannerItemClickCallback = handler;
    this.render();
  }

  /**
   * Registers a handler for item action button click events.
   *
   * @param handler - A function to be called when an action button is clicked.
   */
  public onBannerItemActionClick(handler: (props: CourierBannerItemActionClickEvent) => void): void {
    this._onBannerItemActionClickCallback = handler;
    this.render();
  }

  /**
   * Set a custom content element for the banner item, reusing the {@link CourierBannerItem}
   * container, which provides styling and event handling.
   *
   * @param factory - Function that returns an `HTMLElement` to render as the content.
   */
  public setBannerItemContent(factory?: (props: CourierBannerItemFactoryProps) => HTMLElement) {
    this._customBannerItemContent = factory;
  }

  /**
   * Dismiss the banner item.
   *
   * By default the banner fades out before it's removed. Set `timeoutMs` to
   * `0` to remove the item immediately.
   *
   * @param timeoutMs - the animation duration to fade out the banner item
   */
  public dismiss(timeoutMs: number = CourierBannerItem.dismissAnimationTimeoutMs) {
    this.classList.add('dismissing');

    setTimeout(() => {
      this.remove();

      if (this._onItemDismissedCallback) {
        this._onItemDismissedCallback({ message: this._message });
      }
    }, timeoutMs);
  }

  /** @override */
  protected onComponentMounted(): void {
    this.render();
  }

  /** @override */
  protected onComponentUnmounted(): void {
    this._themeSubscription.unsubscribe();
  }

  get theme(): CourierBannerTheme {
    return this._themeManager.getTheme();
  }

  /** @override */
  static get id(): string {
    return 'courier-banner-item';
  }

  /** @override */
  static get observedAttributes(): string[] {
    return [];
  }

  private get factoryProps(): CourierBannerItemFactoryProps {
    return {
      message: this._message,
      layout: this._layout,
      autoDismiss: this._autoDismiss,
      autoDismissTimeoutMs: this._autoDismissTimeoutMs,
      dismiss: () => this.dismiss(),
    };
  }

  /**
   * Render a banner item, either with default content or custom content if
   * a content factory function is provided.
   *
   * Note: Styles for the banner item are set in {@link CourierBanner}.
   */
  private render(): void {
    // Reset existing content and top-level listeners
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.removeEventListener('click', this.onClick);

    const content = document.createElement('div');
    content.classList.add('content');
    this.appendChild(content);

    if (this._customBannerItemContent) {
      content.appendChild(this._customBannerItemContent(this.factoryProps));
    } else {
      this.appendDefaultContent(content);
    }

    // Click-ability
    if (this._onBannerItemClickCallback) {
      this.classList.add('clickable');
    }
    this.addEventListener('click', this.onClick);
  }

  /** Append the default content for this item into `content`. */
  private appendDefaultContent(content: HTMLElement): void {
    const icon = new CourierIcon(
      this.theme.item?.icon?.color,
      this.theme.item?.icon?.svg,
    );
    icon.classList.add('icon');
    content.appendChild(icon);

    const textContent = document.createElement('div');
    textContent.classList.add('text-content');
    content.appendChild(textContent);

    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = this._message.title ?? '';
    textContent.appendChild(title);

    const body = document.createElement('p');
    body.classList.add('body');
    body.textContent = this._message.preview ?? this._message.body ?? '';
    textContent.appendChild(body);

    if (this.messageHasActions) {
      const actionsContainer = document.createElement('div');
      actionsContainer.classList.add('actions-container');
      textContent.appendChild(actionsContainer);

      this._message.actions?.forEach(action => {
        actionsContainer.appendChild(this.createActionButton(action));
      });
    }

    // Dismiss button, pushed to the trailing edge of the row.
    const dismiss = new CourierIcon(
      this.theme.item?.dismissIcon?.color,
      this.theme.item?.dismissIcon?.svg,
    );
    dismiss.classList.add('dismiss');
    dismiss.addEventListener('click', (event) => {
      event.stopPropagation();
      this.dismiss();
    });
    content.appendChild(dismiss);
  }

  private get messageHasActions() {
    return this._message.actions && this._message.actions.length > 0;
  }

  private createActionButton(action: InboxAction): CourierButton {
    const actionsTheme = this._themeManager.getTheme().item?.actions;

    return new CourierButton({
      mode: this._themeManager.mode,
      text: action.content,
      variant: 'secondary',
      backgroundColor: actionsTheme?.backgroundColor,
      hoverBackgroundColor: actionsTheme?.hoverBackgroundColor,
      activeBackgroundColor: actionsTheme?.activeBackgroundColor,
      border: actionsTheme?.border,
      borderRadius: actionsTheme?.borderRadius,
      shadow: actionsTheme?.shadow,
      fontFamily: actionsTheme?.font?.family,
      fontSize: actionsTheme?.font?.size,
      fontWeight: actionsTheme?.font?.weight,
      textColor: actionsTheme?.font?.color,
      onClick: () => {
        if (this._onBannerItemActionClickCallback) {
          this._onBannerItemActionClickCallback({ message: this._message, action });
        }
      }
    });
  }

  private onClick(event: Event) {
    event.stopPropagation();
    if (this._onBannerItemClickCallback) {
      this._onBannerItemClickCallback({ message: this._message });
    }
  }
}

registerElement(CourierBannerItem);
