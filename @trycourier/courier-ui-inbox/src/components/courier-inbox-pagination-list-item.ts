import { CourierLoadingIndicator } from "@trycourier/courier-ui-core";

export class CourierInboxPaginationListItem extends HTMLElement {
  private loadingElement: CourierLoadingIndicator;
  private observer: IntersectionObserver;
  private onPaginationTrigger: () => void;

  constructor(props: { onPaginationTrigger: () => void }) {
    super();
    this.onPaginationTrigger = props.onPaginationTrigger;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        justify-content: center;
        align-items: start;
        padding: 32px;
        background-color: var(--courier-bg, #ffffff);
        min-height: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    `;

    this.loadingElement = new CourierLoadingIndicator();

    shadow.appendChild(style);
    shadow.appendChild(this.loadingElement);

    // Initialize intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.onPaginationTrigger();
        }
      });
    });

    // Start observing the element
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }
}

if (!customElements.get('courier-inbox-pagination-list-item')) {
  customElements.define('courier-inbox-pagination-list-item', CourierInboxPaginationListItem);
}
