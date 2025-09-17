import { CourierBaseElement, CourierIcon, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { InboxMessage } from "@trycourier/courier-js";

export class CourierInboxToastItem extends CourierBaseElement {
  private static readonly dismissAnimationTimeoutMs = 300;

  private _themeManager: CourierInboxThemeManager;
  private _themeSubscription: CourierInboxThemeSubscription;
  private _toastItemStyle?: HTMLStyleElement;
  private _message?: InboxMessage;
  private readonly _autoDismiss: boolean;
  private readonly _autoDismissTimeoutMs?: number;

  // Callbacks
  private onItemDismissCallback: ((message: InboxMessage) => void) | null = null;
  private onItemClickCallback: ((message: InboxMessage) => void) | null = null;

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

  /** @override */
  protected onComponentMounted(): void {
    this._toastItemStyle = injectGlobalStyle(CourierInboxToastItem.id, this.getStyles(this.theme));

    this.render();
  }

  /** @override */
  protected onComponentUnmounted(): void {
    this._toastItemStyle?.remove();
    this._themeSubscription.unsubscribe();
  }

  get theme(): CourierInboxTheme {
    return this._themeManager.getTheme();
  }

  private getStyles(theme: CourierInboxTheme): string {
    const item = theme.toast?.item;

    return `

    `;
  }

  /**
   * @override
   */
  static get id(): string {
    return 'courier-inbox-toast-item';
  }

  /**
   * @override
   */
  static get observedAttributes(): string[] {
    return [];
  }

  private render(): void {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.removeEventListener('click', this.onClick);

    if (this._autoDismiss) {
      const autoDismiss = document.createElement('div');
      autoDismiss.classList.add('auto-dismiss');
      this.append(autoDismiss);

      setTimeout(this.dismiss.bind(this, CourierInboxToastItem.dismissAnimationTimeoutMs), this._autoDismissTimeoutMs);
    }

    if (this.onItemClickCallback) {
      this.classList.add('clickable');
    }

    this.addEventListener('click', this.onClick);

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

    const dismiss = new CourierIcon(
      this.theme.toast?.item?.dismissIcon?.color,
      this.theme.toast?.item?.dismissIcon?.svg,
    );
    dismiss.classList.add('dismiss');
    dismiss.addEventListener('click', (event) => {
      event.stopPropagation();
      this.remove();

      if (this._message && this.onItemDismissCallback) {
        this.onItemDismissCallback(this._message);
      }
    });
    content.appendChild(dismiss);
  }

  public setMessage(message: InboxMessage) {
    this._message = message;
    this.render();
  }

  public setOnItemDismiss(cb: (message: InboxMessage) => void): void {
    this.onItemDismissCallback = cb;
  }

  public setOnItemClick(cb: (message: InboxMessage) => void): void {
    this.onItemClickCallback = cb;
  }

  private dismiss(timeoutMs: number) {
    this.classList.add('dismissing');
    setTimeout(this.remove.bind(this), timeoutMs);
  }

  private onClick(event: Event) {
    event.stopPropagation();
    if (this._message && this.onItemClickCallback) {
      this.onItemClickCallback(this._message);
    }
  }
}

registerElement(CourierInboxToastItem);
