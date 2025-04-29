import { theme } from "../utils/theme";
import { CourierIcon } from "./icon";

export class CourierIconButton extends HTMLElement {

  // State
  private button: HTMLButtonElement;
  private icon: CourierIcon;

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
        background: var(--courier-button-background-color, transparent);
        transition: background-color 0.2s ease;
      }

      button:hover {
        background-color: var(--courier-button-hover-background-color, ${theme.light.colors.secondary});
      }

      button:active {
        background-color: var(--courier-button-active-background-color, ${theme.light.colors.secondary});
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

  updateIconColor(color: string) {
    this.icon.updateColor(color);
  }

  updateIconSVG(svg: string) {
    this.icon.updateSVG(svg);
  }

  updateBackgroundColor(color: string) {
    this.button.style.setProperty('--courier-button-background-color', color);
  }

  updateHoverBackgroundColor(color: string) {
    this.button.style.setProperty('--courier-button-hover-background-color', color);
  }

  updateActiveBackgroundColor(color: string) {
    this.button.style.setProperty('--courier-button-active-background-color', color);
  }

}

if (!customElements.get('courier-icon-button')) {
  customElements.define('courier-icon-button', CourierIconButton);
}