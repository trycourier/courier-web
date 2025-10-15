import { CourierBaseElement, CourierButton, CourierIcon, registerElement } from "@trycourier/courier-ui-core";
import { CourierToastThemeManager, CourierToastThemeSubscription } from "../types/courier-toast-theme-manager";
import { CourierToastTheme } from "../types/courier-toast-theme";
import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierToastItemActionClickEvent, CourierToastItemClickEvent, CourierToastItemFactoryProps } from "../types/toast";

/**
 * Default implementation of a Toast item.
 *
 * @see {@link CourierToast}
 * @public
 */
export class CourierToastItem extends CourierBaseElement {
  /** The animation duration to fade out a dismissed toast before its element is removed. */
  private static readonly dismissAnimationTimeoutMs = 300;

  private _themeManager: CourierToastThemeManager;
  private _themeSubscription: CourierToastThemeSubscription;
  private _message: InboxMessage;
  private _customToastItemContent?: (props: CourierToastItemFactoryProps) => HTMLElement;

  /** Whether this toast item is auto-dismissed. */
  private readonly _autoDismiss: boolean;

  /** The timeout before the toast item is auto-dismissed, applicable if _autoDismiss is true. */
  private readonly _autoDismissTimeoutMs: number;

  // Callbacks
  private _onItemDismissedCallback: ((props: { message: InboxMessage }) => void) | null = null;
  private _onToastItemClickCallback: ((props: CourierToastItemClickEvent) => void) | null = null;
  private _onToastItemActionClickCallback: ((props: CourierToastItemActionClickEvent) => void) | null = null;

  constructor(props: {
    message: InboxMessage,
    autoDismiss: boolean,
    autoDismissTimeoutMs: number,
    themeManager: CourierToastThemeManager,
  }) {

    super();
    this._message = props.message;
    this._autoDismiss = props.autoDismiss;
    this._autoDismissTimeoutMs = props.autoDismissTimeoutMs;

    this._themeManager = props.themeManager;
    this._themeSubscription = this._themeManager.subscribe((_: CourierToastTheme) => {
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
  public onToastItemClick(handler: (props: CourierToastItemClickEvent) => void): void {
    this._onToastItemClickCallback = handler;

    // Re-render to set/un-set the .clickable class
    this.render();
  }

  /**
   * Registers a handler for item click events.
   *
   * @param handler - A function to be called when the item is clicked.
   */
  public onToastItemActionClick(handler: (props: CourierToastItemActionClickEvent) => void): void {
    this._onToastItemActionClickCallback = handler;

    // Re-render to set/un-set the .clickable class
    this.render();
  }


  /**
   * Set a custom content element for the toast item, reusing the {@link CourierToastItem}
   * container, which provides styling, animations, and event handling.
   *
   * @param factory - Function that returns an `HTMLElement` to render as the content.
   */
  public setToastItemContent(factory?: (props: CourierToastItemFactoryProps) => HTMLElement) {
    this._customToastItemContent = factory;
  }

  /**
   * Dismiss the toast item.
   *
   * By default the toast fades out before it's removed. Set `timeoutMs` to
   * `0` to remove the item immediately.
   *
   * @param timeoutMs - the animation duration to fade out the toast item
   */
  public dismiss(timeoutMs: number = CourierToastItem.dismissAnimationTimeoutMs) {
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

  get theme(): CourierToastTheme {
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
    }

    // Content
    if (this._customToastItemContent) {
      overflowHiddenContainer.appendChild(this._customToastItemContent({ message: this._message, autoDismiss: this._autoDismiss, autoDismissTimeoutMs: this._autoDismissTimeoutMs }));
    } else {
      overflowHiddenContainer.appendChild(this.createDefaultContent());
    }

    // Click-ability
    if (this._onToastItemClickCallback) {
      this.classList.add('clickable');
    }

    this.addEventListener('click', this.onClick);

    // Dismiss button
    const dismiss = new CourierIcon(
      this.theme.item?.dismissIcon?.color,
      this.theme.item?.dismissIcon?.svg,
    );
    dismiss.classList.add('dismiss');
    dismiss.addEventListener('click', (event) => {
      event.stopPropagation();
      this.remove();

      if (this._onItemDismissedCallback) {
        this._onItemDismissedCallback({ message: this._message });
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
        const button = this.createActionButton(action);
        actionsContainer.appendChild(button);
      });
    }

    return content;
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
        if (this._onToastItemActionClickCallback) {
          this._onToastItemActionClickCallback({ message: this._message, action });
        }
      }
    });


  }

  private onClick(event: Event) {
    event.stopPropagation();
    if (this._onToastItemClickCallback) {
      this._onToastItemClickCallback({ message: this._message });
    }
  }
}

registerElement(CourierToastItem);
