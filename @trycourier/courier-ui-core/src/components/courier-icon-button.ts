import { CourierBaseElement } from "./courier-base-element";
import { CourierIcon } from "./courier-icon";

export class CourierIconButton extends CourierBaseElement {

  static get id(): string {
    return 'courier-icon-button';
  }

  // State
  private _backgroundColor?: string;
  private _hoverBackgroundColor?: string;
  private _activeBackgroundColor?: string;
  private _borderRadius?: string;
  private _height?: string;
  private _width?: string;

  // Elements
  private _style: HTMLStyleElement;
  private _button: HTMLButtonElement;
  private _icon: CourierIcon;

  constructor(svg?: string, color?: string, backgroundColor?: string, hoverBackgroundColor?: string, activeBackgroundColor?: string, borderRadius?: string, height?: string, width?: string, iconSize?: string) {
    super();

    this._borderRadius = borderRadius;
    this._backgroundColor = backgroundColor;
    this._hoverBackgroundColor = hoverBackgroundColor;
    this._activeBackgroundColor = activeBackgroundColor;
    this._height = height;
    this._width = width;

    const shadow = this.attachShadow({ mode: 'open' });

    this._button = document.createElement('button');
    this._button.setAttribute('part', 'button');
    this._icon = new CourierIcon(color, svg, iconSize);

    this._style = document.createElement('style');
    this.refresh();

    shadow.appendChild(this._style);
    this._button.appendChild(this._icon);
    shadow.appendChild(this._button);
  }

  private refresh() {
    this._style.textContent = this.getStyles();
  }

  private getStyles(): string {
    return `
      :host {
        display: inline-block;
        border-radius: ${this._borderRadius ?? '50%'};
      }

      button {
        border: none;
        border-radius: ${this._borderRadius ?? '50%'};
        cursor: pointer;
        width: ${this._width ?? '36px'};
        height: ${this._height ?? '36px'};
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${this._backgroundColor ?? 'transparent'};
        transition: background-color 0.2s ease;
        touch-action: manipulation;
      }

      button:hover {
        background-color: ${this._hoverBackgroundColor ?? 'red'};
      }

      button:active {
        background-color: ${this._activeBackgroundColor ?? 'red'};
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
  }

  updateIconColor(color: string) {
    this._icon.updateColor(color);
  }

  updateIconSVG(svg: string) {
    this._icon.updateSVG(svg);
  }

  updateBackgroundColor(color: string) {
    this._backgroundColor = color;
    this.refresh();
  }

  updateHoverBackgroundColor(color: string) {
    this._hoverBackgroundColor = color;
    this.refresh();
  }

  updateActiveBackgroundColor(color: string) {
    this._activeBackgroundColor = color;
    this.refresh();
  }

  updateIconSize(size: string) {
    this._icon.updateSize(size);
  }

}
