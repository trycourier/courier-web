import { CourierInteractive } from "./interaction";

export class CourierButton extends CourierInteractive {
  private button: HTMLButtonElement;
  static observedAttributes = ['variant', 'size', 'disabled', 'color'];

  constructor() {
    super();
    const shadow = this.shadowRoot!;

    this.button = document.createElement('button');
    this.button.setAttribute('part', 'button');

    const style = document.createElement('style');
    style.textContent = `
      button {
        border: none;
        border-radius: 4px;
        font-weight: 500;
        font-family: inherit;
        font-size: 14px;
        padding: 2px;
        cursor: pointer;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
      }

      /* Variants */
      button.primary {
        background-color: var(--courier-button-color, #0a0a0a);
        color: white;
      }

      button.secondary {
        background-color: white;
        color: var(--courier-button-color, #0a0a0a);
        border: 1px solid #e5e5e5;
      }

      button.tertiary {
        background-color: #e5e5e5;
        color: #171717;
        box-shadow: none;
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

    shadow.appendChild(style);
    shadow.appendChild(this.button);

    this.updateVariant();
    this.updateSize();
    this.updateColor();

    // Add click handler to the button element
    this.button.addEventListener('click', (event: MouseEvent) => {
      // Prevent event from being captured by shadow DOM
      event.stopPropagation();

      // Dispatch both native click and custom courier-click events
      this.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        composed: true,
        cancelable: true
      }));
    });
  }

  connectedCallback() {
    super.connectedCallback();
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
      case 'color':
        this.updateColor();
        break;
    }
  }

  private updateVariant() {
    const variant = this.getAttribute('variant') || 'primary';
    this.button.className = `${variant} ${this.button.className.split(' ').filter(c => !['primary', 'secondary', 'tertiary'].includes(c)).join(' ')}`;
  }

  private updateSize() {
    const size = this.getAttribute('size') || 'medium';
    this.button.className = `${this.button.className.split(' ').filter(c => !['small', 'medium', 'large'].includes(c)).join(' ')} ${size}`;
  }

  private updateColor() {
    const color = this.getAttribute('color');
    if (color) {
      this.button.style.setProperty('--courier-button-color', color);
    } else {
      this.button.style.removeProperty('--courier-button-color');
    }
  }
}

if (!customElements.get('courier-button')) {
  customElements.define('courier-button', CourierButton);
}