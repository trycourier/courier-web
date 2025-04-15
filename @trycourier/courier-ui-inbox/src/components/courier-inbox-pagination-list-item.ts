import { CourierLoadingIndicator } from "@trycourier/courier-ui-core";

export class CourierInboxPaginationListItem extends HTMLElement {
  private loadingElement: CourierLoadingIndicator;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        padding: 16px;
        background-color: var(--courier-bg, #ffffff);
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .content {
        display: none;
      }

      :host([loading]) .loading {
        display: flex;
      }

      :host([loading]) .content {
        display: none;
      }

      :host(:not([loading])) .loading {
        display: none;
      }

      :host(:not([loading])) .content {
        display: block;
      }
    `;

    this.loadingElement = new CourierLoadingIndicator();
    this.loadingElement.className = 'loading';

    shadow.appendChild(style);
    shadow.appendChild(this.loadingElement);
  }

}

if (!customElements.get('courier-inbox-pagination-list-item')) {
  customElements.define('courier-inbox-pagination-list-item', CourierInboxPaginationListItem);
}
