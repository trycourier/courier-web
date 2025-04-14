import { CourierLoadingIndicator } from "./loading-indicator";

export class CourierLoadingState extends HTMLElement {
  private loadingIndicator: CourierLoadingIndicator;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.loadingIndicator = new CourierLoadingIndicator();

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.loadingIndicator);
  }
}

// Register the custom element
if (!customElements.get('courier-loading-state')) {
  customElements.define('courier-loading-state', CourierLoadingState);
}
