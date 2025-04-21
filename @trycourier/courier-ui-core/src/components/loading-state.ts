import { CourierLoadingIndicator } from "./loading-indicator";
import { CourierElement } from "./courier-element";

export class CourierLoadingState extends CourierElement {
  private _loadingIndicator?: CourierLoadingIndicator;

  defaultElement(): HTMLElement {
    this._loadingIndicator = new CourierLoadingIndicator();

    const container = document.createElement('div');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;

    container.className = 'container';
    container.appendChild(style);
    container.appendChild(this._loadingIndicator);
    this.shadow.appendChild(container);

    return container;
  }
}

// Register the custom element
if (!customElements.get('courier-loading-state')) {
  customElements.define('courier-loading-state', CourierLoadingState);
}
