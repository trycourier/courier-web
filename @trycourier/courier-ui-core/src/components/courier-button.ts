import { SystemThemeMode } from "../utils/system-theme-mode";
import { theme } from "../utils/theme";
import { CourierSystemThemeElement } from "./courier-system-theme-element";

export type CourierButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type CourierButtonProps = {
  text?: string,
  shadow?: string,
  border?: string,
  borderRadius?: string,
  backgroundColor?: string,
  hoverBackgroundColor?: string,
  activeBackgroundColor?: string,
  fontFamily?: string,
  fontSize?: string,
  fontWeight?: string,
  textColor?: string,
  variant?: CourierButtonVariant
}

const baseButtonStyles = {
  borderRadius: '4px',
  fontSize: '14px'
} as const;

export const CourierButtonVariants = {
  primary: (mode: SystemThemeMode) => ({
    ...baseButtonStyles,
    backgroundColor: theme[mode].colors.primary,
    textColor: theme[mode].colors.secondary,
    fontWeight: '500',
    shadow: 'none'
  }),

  secondary: (mode: SystemThemeMode) => ({
    ...baseButtonStyles,
    backgroundColor: theme[mode].colors.secondary,
    textColor: theme[mode].colors.primary,
    fontWeight: '500',
    border: `1px solid ${theme[mode].colors.border}`,
    shadow: mode === 'light'
      ? '0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
      : '0px 1px 2px 0px rgba(255, 255, 255, 0.1)'
  }),

  tertiary: (mode: SystemThemeMode) => ({
    ...baseButtonStyles,
    backgroundColor: theme[mode].colors.border,
    textColor: theme[mode].colors.primary,
    fontWeight: '500',
    border: 'none',
    shadow: 'none'
  })
} as const;

export class CourierButton extends CourierSystemThemeElement {

  // Components
  private _button: HTMLButtonElement;
  private _style: HTMLStyleElement;

  constructor(props: CourierButtonProps) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this._button = document.createElement('button');
    this._button.setAttribute('part', 'button');

    this._style = document.createElement('style');
    this._style.textContent = this.getStyles(props);

    shadow.appendChild(this._style);
    shadow.appendChild(this._button);

    this.updateButton(props);
  }

  private getStyles(props: CourierButtonProps): string {

    const defaultTextColor = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.textColor;
    }

    const defaultBackgroundColor = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.backgroundColor;
    }

    const defaultBorder = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.border;
    }

    const defaultShadow = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.shadow;
    }

    const defaultBorderRadius = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.borderRadius;
    }

    const defaultFontSize = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.fontSize;
    }

    const defaultFontWeight = () => {
      const secondary = CourierButtonVariants.secondary(this.currentSystemTheme);
      return secondary.fontWeight;
    }

    return `
      :host {
        display: inline-block;
      }

      button {
        border: none;
        border-radius: ${props.borderRadius ?? defaultBorderRadius()};
        font-weight: ${props.fontWeight ?? defaultFontWeight()};
        font-family: ${props.fontFamily ?? 'inherit'};
        font-size: ${props.fontSize ?? defaultFontSize()};
        padding: 6px 10px;
        cursor: pointer;
        width: 100%;
        height: 100%;
        background-color: ${props.backgroundColor ?? defaultBackgroundColor()};
        color: ${props.textColor ?? defaultTextColor()};
        border: ${props.border ?? defaultBorder()};
        box-shadow: ${props.shadow ?? defaultShadow()};
      }

      button:hover {
        ${props.hoverBackgroundColor ? `background-color: ${props.hoverBackgroundColor};` : 'filter: brightness(0.9);'}
      }

      button:active {
        ${props.activeBackgroundColor ? `background-color: ${props.activeBackgroundColor};` : 'filter: brightness(0.8);'}
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
  }

  public updateButton(props: CourierButtonProps) {
    if (props.text) {
      this._button.textContent = props.text;
    }
    this._style.textContent = this.getStyles(props);
  }
}

if (!customElements.get('courier-button')) {
  customElements.define('courier-button', CourierButton);
}