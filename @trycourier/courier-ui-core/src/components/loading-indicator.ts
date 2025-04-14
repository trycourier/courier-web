export class CourierLoadingIndicator extends HTMLElement {
  private spinner: HTMLElement;
  private text: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Create spinner element
    this.spinner = document.createElement('div');
    this.spinner.className = 'spinner';

    // Create text element
    this.text = document.createElement('div');
    this.text.className = 'text';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--courier-text-secondary, #6b7280);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .text {
        margin-top: 8px;
        color: var(--courier-text-secondary, #6b7280);
        font-size: 14px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.spinner);
    shadow.appendChild(this.text);
  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'text' && oldValue !== newValue) {
      this.text.textContent = newValue || 'Loading...';
    }
  }
}

// Register the custom element
if (!customElements.get('courier-loading-indicator')) {
  customElements.define('courier-loading-indicator', CourierLoadingIndicator);
}
