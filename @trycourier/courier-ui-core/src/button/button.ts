export class CourierButton extends HTMLElement {
  private button: HTMLButtonElement;
  static observedAttributes = ['variant', 'size', 'disabled'];

  constructor() {
    super();
    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Create button element
    this.button = document.createElement('button');
    this.button.setAttribute('part', 'button');

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      button {
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      /* Variants */
      button.primary {
        background-color: var(--courier-button-primary-bg, #2563eb);
        color: var(--courier-button-primary-color, white);
      }

      button.secondary {
        background-color: var(--courier-button-secondary-bg, #e5e7eb);
        color: var(--courier-button-secondary-color, #1f2937);
      }

      /* Sizes */
      button.small {
        padding: 6px 12px;
        font-size: 14px;
      }

      button.medium {
        padding: 8px 16px;
        font-size: 16px;
      }

      button.large {
        padding: 12px 24px;
        font-size: 18px;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;

    // Append elements to shadow root
    shadow.appendChild(style);
    shadow.appendChild(this.button);

    // Set initial attributes
    this.updateVariant();
    this.updateSize();
  }

  connectedCallback() {
    // Move slot content into button
    const slot = document.createElement('slot');
    this.button.appendChild(slot);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'variant':
        this.updateVariant();
        break;
      case 'size':
        this.updateSize();
        break;
      case 'disabled':
        this.button.disabled = this.hasAttribute('disabled');
        break;
    }
  }

  private updateVariant() {
    const variant = this.getAttribute('variant') || 'primary';
    this.button.className = `${variant} ${this.button.className.split(' ').filter(c => !['primary', 'secondary'].includes(c)).join(' ')}`;
  }

  private updateSize() {
    const size = this.getAttribute('size') || 'medium';
    this.button.className = `${this.button.className.split(' ').filter(c => !['small', 'medium', 'large'].includes(c)).join(' ')} ${size}`;
  }
}

// Register the custom element
if (!customElements.get('courier-button')) {
  customElements.define('courier-button', CourierButton);
}