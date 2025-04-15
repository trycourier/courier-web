import { theme } from "../utils/theme";

export type CourierButtonVariant = 'primary' | 'secondary' | 'tertiary';

export class CourierButton extends HTMLElement {
  private button: HTMLButtonElement;
  static observedAttributes = [
    'disabled',
    'background-color',
    'corner-radius',
    'border-color',
    'border-radius',
    'font-family',
    'font-size',
    'font-weight',
    'variant',
    'mode',
    'text-color'
  ];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.button = document.createElement('button');
    this.button.setAttribute('part', 'button');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      button {
        border: none;
        border-radius: var(--courier-button-border-radius, var(--courier-button-corner-radius, ${theme.light.button.cornerRadius}));
        font-weight: var(--courier-button-font-weight, 500);
        font-family: var(--courier-button-font-family, inherit);
        font-size: var(--courier-button-font-size, 14px);
        padding: 6px 10px;
        cursor: pointer;
        width: 100%;
        height: 100%;
        background-color: var(--courier-button-background-color, ${theme.light.colors.primary});
        color: var(--courier-button-text-color, ${theme.light.colors.secondary});
      }

      button:hover {
        filter: brightness(0.9);
      }

      button:active {
        filter: brightness(0.8);
      }
        
      button[data-variant="primary"] {
        background-color: var(--courier-button-background-color, ${theme.light.colors.primary});
        color: var(--courier-button-text-color, ${theme.light.colors.secondary});
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
      }

      button[data-variant="secondary"] {
        background-color: var(--courier-button-background-color, ${theme.light.colors.secondary});
        color: var(--courier-button-text-color, ${theme.light.colors.primary});
        border: 1px solid var(--courier-button-border-color, ${theme.light.colors.border});
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
      }

      button[data-variant="tertiary"] {
        background-color: var(--courier-button-background-color, ${theme.light.colors.border});
        color: var(--courier-button-text-color, ${theme.light.colors.primary});
        border: none;
        box-shadow: none;
      }

      button[data-mode="dark"][data-variant="primary"] {
        background-color: var(--courier-button-background-color, ${theme.dark.colors.primary});
        color: var(--courier-button-text-color, ${theme.dark.colors.secondary});
        box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.1);
      }

      button[data-mode="dark"][data-variant="secondary"] {
        background-color: var(--courier-button-background-color, ${theme.dark.colors.secondary});
        color: var(--courier-button-text-color, ${theme.dark.colors.primary});
        border: 1px solid var(--courier-button-border-color, ${theme.dark.colors.border});
        box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.1);
      }

      button[data-mode="dark"][data-variant="tertiary"] {
        background-color: var(--courier-button-background-color, ${theme.dark.colors.border});
        color: var(--courier-button-text-color, ${theme.dark.colors.primary});
        border: none;
        box-shadow: none;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.button);

    this.updateCustomStyles();
    this.updateVariant();
  }

  connectedCallback() {
    const slot = document.createElement('slot');
    this.button.appendChild(slot);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'disabled':
        this.button.disabled = this.hasAttribute('disabled');
        break;
      case 'variant':
      case 'mode':
        this.updateVariant();
        break;
      case 'background-color':
      case 'corner-radius':
      case 'border-color':
      case 'border-radius':
      case 'font-family':
      case 'font-size':
      case 'font-weight':
      case 'text-color':
        this.updateCustomStyles();
        break;
    }
  }

  private updateVariant() {
    const variant = this.getAttribute('variant') as CourierButtonVariant | null;
    const mode = this.getAttribute('mode') || 'light';

    if (variant) {
      this.button.setAttribute('data-variant', variant);
      this.button.setAttribute('data-mode', mode);
    } else {
      this.button.removeAttribute('data-variant');
      this.button.removeAttribute('data-mode');
    }
  }

  private updateCustomStyles() {
    const backgroundColor = this.getAttribute('background-color');
    const cornerRadius = this.getAttribute('corner-radius');
    const borderColor = this.getAttribute('border-color');
    const borderRadius = this.getAttribute('border-radius');
    const fontFamily = this.getAttribute('font-family');
    const fontSize = this.getAttribute('font-size');
    const fontWeight = this.getAttribute('font-weight');
    const textColor = this.getAttribute('text-color');

    if (backgroundColor) {
      this.button.style.setProperty('--courier-button-background-color', backgroundColor);
    } else {
      this.button.style.removeProperty('--courier-button-background-color');
    }

    if (cornerRadius) {
      this.button.style.setProperty('--courier-button-corner-radius', cornerRadius);
    } else {
      this.button.style.removeProperty('--courier-button-corner-radius');
    }

    if (borderColor) {
      this.button.style.setProperty('--courier-button-border-color', borderColor);
    } else {
      this.button.style.removeProperty('--courier-button-border-color');
    }

    if (borderRadius) {
      this.button.style.setProperty('--courier-button-border-radius', borderRadius);
    } else {
      this.button.style.removeProperty('--courier-button-border-radius');
    }

    if (fontFamily) {
      this.button.style.setProperty('--courier-button-font-family', fontFamily);
    } else {
      this.button.style.removeProperty('--courier-button-font-family');
    }

    if (fontSize) {
      this.button.style.setProperty('--courier-button-font-size', fontSize);
    } else {
      this.button.style.removeProperty('--courier-button-font-size');
    }

    if (fontWeight) {
      this.button.style.setProperty('--courier-button-font-weight', fontWeight);
    } else {
      this.button.style.removeProperty('--courier-button-font-weight');
    }

    if (textColor) {
      this.button.style.setProperty('--courier-button-text-color', textColor);
    } else {
      this.button.style.removeProperty('--courier-button-text-color');
    }
  }

  public setAttributes(attributes: {
    disabled?: boolean;
    backgroundColor?: string;
    cornerRadius?: string;
    borderColor?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    variant?: CourierButtonVariant;
    mode?: string;
    textColor?: string;
  }): void {
    if (attributes.disabled !== undefined) {
      if (attributes.disabled) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    if (attributes.backgroundColor) {
      this.setAttribute('background-color', attributes.backgroundColor);
    }
    if (attributes.cornerRadius) {
      this.setAttribute('corner-radius', attributes.cornerRadius);
    }
    if (attributes.borderColor) {
      this.setAttribute('border-color', attributes.borderColor);
    }
    if (attributes.borderRadius) {
      this.setAttribute('border-radius', attributes.borderRadius);
    }
    if (attributes.fontFamily) {
      this.setAttribute('font-family', attributes.fontFamily);
    }
    if (attributes.fontSize) {
      this.setAttribute('font-size', attributes.fontSize);
    }
    if (attributes.fontWeight) {
      this.setAttribute('font-weight', attributes.fontWeight);
    }
    if (attributes.variant) {
      this.setAttribute('variant', attributes.variant);
    }
    if (attributes.mode) {
      this.setAttribute('mode', attributes.mode);
    }
    if (attributes.textColor) {
      this.setAttribute('text-color', attributes.textColor);
    }
  }
}

if (!customElements.get('courier-button')) {
  customElements.define('courier-button', CourierButton);
}