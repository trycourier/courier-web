import { CourierIcon } from "@trycourier/courier-ui-core";
import { CourierInboxMenuOption } from "./courier-inbox-filter-menu";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxHeaderTitle extends HTMLElement {

  // Components
  private _titleElement: HTMLHeadingElement;
  private _iconElement: CourierIcon;
  private _unreadBadge: CourierUnreadCountBadge;
  private _container: HTMLDivElement;

  // State
  private _option: CourierInboxMenuOption;

  constructor(props: { option: CourierInboxMenuOption }) {
    super();
    this._option = props.option;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .title-section {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
      }

      courier-icon {
        display: flex;
        align-items: center;
      }

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 50;
        color: var(--courier-text-primary, #111827);
      }
    `;

    this._container = document.createElement('div');
    this._container.className = 'title-section';

    this._iconElement = new CourierIcon();
    this._iconElement.setAttribute('svg', this._option.icon);

    this._titleElement = document.createElement('h2');
    this._unreadBadge = new CourierUnreadCountBadge();

    this._container.appendChild(this._iconElement);
    this._container.appendChild(this._titleElement);
    this._container.appendChild(this._unreadBadge);

    shadow.appendChild(style);
    shadow.appendChild(this._container);

    this.update(props.option, 0);
  }

  public update(option: CourierInboxMenuOption, unreadCount: number) {
    this._option = option;
    this._iconElement.setAttribute('svg', option.icon);
    this._titleElement.textContent = option.label;
    this._unreadBadge.setCount(unreadCount);
  }

}

if (!customElements.get('courier-inbox-header-title')) {
  customElements.define('courier-inbox-header-title', CourierInboxHeaderTitle);
}