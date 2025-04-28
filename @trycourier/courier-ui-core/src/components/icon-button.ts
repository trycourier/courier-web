import { theme } from "../utils/theme";
import { CourierIcon } from "./icon";

export class CourierIconButton extends HTMLElement {
  private button: HTMLButtonElement;
  private icon: HTMLElement;
  static observedAttributes = [
    'disabled',
    'background-color',
    'corner-radius',
    'border-color',
    'border-radius',
    'variant',
    'mode',
    'text-color',
    'icon'
  ];

  constructor(svg?: string, color?: string) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.button = document.createElement('button');
    this.button.setAttribute('part', 'button');

    this.icon = new CourierIcon(color, svg);

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
        width: 24px;
        height: 24px;
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