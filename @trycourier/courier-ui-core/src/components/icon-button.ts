import { theme } from "../utils/theme";
import { CourierIcon, CourierIconName } from "./icon";

export class CourierIconButton extends HTMLElement {
  private button: HTMLButtonElement;
  private icon: HTMLElement;
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
    'text-color',
    'icon'
  ];

  constructor(icon: CourierIconName) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.button = document.createElement('button');
    this.button.setAttribute('part', 'button');

    if (typeof icon === 'string' && icon.startsWith('http')) {
      this.icon = document.createElement('img');
      this.icon.setAttribute('src', icon);
      this.icon.setAttribute('alt', 'icon');
    } else {
      this.icon = new CourierIcon(icon as CourierIconName);
    }

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      button {
        border: none;
        border-radius: 50%;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
      }

      button:hover {
        filter: brightness(0.9);
        background-color: var(--courier-button-background-color, ${theme.light.colors.secondary});
      }

      button:active {
        filter: brightness(0.8);
        background-color: var(--courier-button-background-color, ${theme.light.colors.secondary});
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      [part="icon"] {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
      }
    `;

    shadow.appendChild(style);
    this.button.appendChild(this.icon);
    shadow.appendChild(this.button);
  }
}

if (!customElements.get('courier-icon-button')) {
  customElements.define('courier-icon-button', CourierIconButton);
}