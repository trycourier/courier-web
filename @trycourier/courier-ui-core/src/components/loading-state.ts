export class CourierLoadingState extends HTMLElement {
  private container: HTMLElement;
  private loadingIndicator: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.container = document.createElement('div');
    this.loadingIndicator = document.createElement('courier-loading-indicator');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        width: 100%;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.container);
    this.container.appendChild(this.loadingIndicator);
  }
}

// Register the custom element
if (!customElements.get('courier-loading-state')) {
  customElements.define('courier-loading-state', CourierLoadingState);
}

