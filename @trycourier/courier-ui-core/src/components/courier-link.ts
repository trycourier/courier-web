import { theme } from "../utils/theme";
import { CourierBaseElement } from "./courier-base-element";

export class CourierLink extends CourierBaseElement {

  static get id(): string {
    return 'courier-link';
  }

  private link: HTMLAnchorElement;
  static observedAttributes = [
    'href',
    'variant',
    'disabled',
    'color',
    'underline',
    'mode',
    'target',
    'font-family',
    'font-size'
  ];

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
        font-family: var(--courier-link-font-family, inherit);
        font-size: var(--courier-link-font-size, inherit);
      }

      /* Variants */
      a[data-variant="primary"][data-mode="light"] {
        color: var(--courier-link-color, ${theme.light.colors.link});
      }

      a[data-variant="primary"][data-mode="light"]:hover {
        opacity: 0.8;
      }

      a[data-variant="primary"][data-mode="light"]:active {
        opacity: 0.6;
      }

      a[data-variant="primary"][data-mode="dark"] {
        color: var(--courier-link-color, ${theme.dark.colors.link});
      }

      a[data-variant="primary"][data-mode="dark"]:hover {
        opacity: 0.8;
      }

      a[data-variant="primary"][data-mode="dark"]:active {
        opacity: 0.6;
      }

      a[data-underline="true"] {
        text-decoration: underline;
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
    this.updateUnderline();
    this.updateMode();
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
      case 'mode':
        this.updateVariant();
        break;
      case 'disabled':
        this.link.style.pointerEvents = this.hasAttribute('disabled') ? 'none' : 'auto';
        this.link.style.opacity = this.hasAttribute('disabled') ? '0.6' : '1';
        break;
      case 'color':
        this.updateColor();
        break;
      case 'underline':
        this.updateUnderline();
        break;
      case 'target':
        this.updateTarget();
        break;
      case 'font-family':
        this.updateFontFamily();
        break;
      case 'font-size':
        this.updateFontSize();
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
    const mode = this.getAttribute('mode') || 'light';
    this.link.setAttribute('data-variant', variant);
    this.link.setAttribute('data-mode', mode);
  }

  private updateColor() {
    const color = this.getAttribute('color');
    if (color) {
      this.link.style.setProperty('--courier-link-color', color);
    } else {
      this.link.style.removeProperty('--courier-link-color');
    }
  }

  private updateUnderline() {
    const underline = this.getAttribute('underline') === 'true';
    this.link.setAttribute('data-underline', underline.toString());
  }

  private updateMode() {
    const mode = this.getAttribute('mode') || 'light';
    this.link.setAttribute('data-mode', mode);
  }

  private updateTarget() {
    const target = this.getAttribute('target');
    if (target) {
      this.link.target = target;
    }
  }

  private updateFontFamily() {
    const fontFamily = this.getAttribute('font-family');
    if (fontFamily) {
      this.link.style.setProperty('--courier-link-font-family', fontFamily);
    } else {
      this.link.style.removeProperty('--courier-link-font-family');
    }
  }

  private updateFontSize() {
    const fontSize = this.getAttribute('font-size');
    if (fontSize) {
      this.link.style.setProperty('--courier-link-font-size', fontSize);
    } else {
      this.link.style.removeProperty('--courier-link-font-size');
    }
  }
}
