export class CourierLink extends HTMLElement {
  private link: HTMLAnchorElement;
  static observedAttributes = ['href', 'variant', 'size', 'disabled'];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.link = document.createElement('a');
    this.link.setAttribute('part', 'link');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      a {
        text-decoration: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      /* Variants */
      a.primary {
        color: var(--courier-link-primary-color, #2563eb);
      }

      a.secondary {
        color: var(--courier-link-secondary-color, #6b7280);
      }

      /* Sizes */
      a.small {
        font-size: 14px;
      }

      a.medium {
        font-size: 16px;
      }

      a.large {
        font-size: 18px;
      }

      a:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.link);

    this.updateVariant();
    this.updateSize();
  }

  connectedCallback() {
    const slot = document.createElement('slot');
    this.link.appendChild(slot);
    this.updateHref();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'href':
        this.updateHref();
        break;
      case 'variant':
        this.updateVariant();
        break;
      case 'size':
        this.updateSize();
        break;
      case 'disabled':
        this.link.style.pointerEvents = this.hasAttribute('disabled') ? 'none' : 'auto';
        this.link.style.opacity = this.hasAttribute('disabled') ? '0.6' : '1';
        break;
    }
  }

  private updateHref() {
    const href = this.getAttribute('href');
    if (href) {
      this.link.href = href;
    }
  }

  private updateVariant() {
    const variant = this.getAttribute('variant') || 'primary';
    this.link.className = `${variant} ${this.link.className.split(' ').filter(c => !['primary', 'secondary'].includes(c)).join(' ')}`;
  }

  private updateSize() {
    const size = this.getAttribute('size') || 'medium';
    this.link.className = `${this.link.className.split(' ').filter(c => !['small', 'medium', 'large'].includes(c)).join(' ')} ${size}`;
  }
}

// Register the custom element
if (!customElements.get('courier-link')) {
  customElements.define('courier-link', CourierLink);
}
