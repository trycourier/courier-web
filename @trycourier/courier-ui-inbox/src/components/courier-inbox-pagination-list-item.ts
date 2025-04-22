import { CourierLoadingIndicator } from "@trycourier/courier-ui-core";

export class CourierInboxPaginationListItem extends HTMLElement {
  private loadingElement?: CourierLoadingIndicator;
  private observer: IntersectionObserver;
  private onPaginationTrigger: () => void;
  private customItem?: HTMLElement;

  constructor(props: { customItem?: HTMLElement, onPaginationTrigger: () => void }) {
    super();
    this.onPaginationTrigger = props.onPaginationTrigger;
    this.customItem = props.customItem;

    const shadow = this.attachShadow({ mode: 'open' });

    // Add styles to remove padding/margin and set box-sizing
    const style = document.createElement('style');
    style.textContent = `
      :host {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
    `;
    shadow.appendChild(style);

    if (this.customItem) {
      shadow.appendChild(this.customItem);
    } else {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: start;
        padding: 32px;
        background-color: var(--courier-bg, #ffffff);
        min-height: 100%;
        height: 150%;
        box-sizing: border-box;
      `;

      this.loadingElement = new CourierLoadingIndicator();
      wrapper.appendChild(this.loadingElement);
      shadow.appendChild(wrapper);
    }

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
