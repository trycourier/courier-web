import { CourierComponentThemeMode, SystemThemeMode } from "../utils/system-theme-mode";
import { theme } from "../utils/theme";
import { CourierColors } from "../utils/courier-colors";
import { CourierSystemThemeElement } from "./courier-system-theme-element";

export type CourierButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link';

export type CourierButtonProps = {
  mode: CourierComponentThemeMode
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
  padding?: string,
  textDecoration?: string,
  variant?: CourierButtonVariant,
  onClick?: () => void
}

/**
 * A button with no visible outline still reserves the same border box as one that has an
 * outline, so a filled and an outlined button sitting in the same row line up.
 */
export const TRANSPARENT_BORDER = '1px solid transparent';

const baseButtonStyles = {
  borderRadius: '4px',
  fontSize: '14px',
  padding: '6px 10px',
  textDecoration: 'none'
} as const;

export const CourierButtonVariants = {
  primary: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: theme[mode].colors.primary,
      textColor: theme[mode].colors.secondary,
      fontWeight: '500',
      // The fill sits at whichever end of the scale the mode is not, so there is nothing to dim
      // it toward — the brightness fallback would move a near-black fill by two values and dim
      // the label instead. Each mode steps toward the middle rather than past the end.
      hoverBackgroundColor: mode === 'light' ? CourierColors.gray[800] : CourierColors.gray[200],
      activeBackgroundColor: mode === 'light' ? CourierColors.gray[700] : CourierColors.gray[500],
      border: TRANSPARENT_BORDER,
      shadow: 'none'
    };
  },

  secondary: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: theme[mode].colors.secondary,
      textColor: theme[mode].colors.primary,
      fontWeight: '500',
      // Opaque rather than translucent: an action can sit on a floating surface (a toast) where
      // page content would otherwise show through the overlay.
      hoverBackgroundColor: mode === 'light' ? CourierColors.gray[200] : CourierColors.gray[800],
      activeBackgroundColor: mode === 'light' ? CourierColors.gray[500] : CourierColors.gray[700],
      border: `1px solid ${theme[mode].colors.border}`,
      shadow: mode === 'light'
        ? '0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
        : '0px 1px 2px 0px rgba(255, 255, 255, 0.1)'
    };
  },

  /**
   * The quietest button: the same box as its siblings, drawn with nothing but its label.
   */
  tertiary: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: 'transparent',
      textColor: theme[mode].colors.primary,
      fontWeight: '500',
      border: TRANSPARENT_BORDER,
      shadow: 'none',
      // Like a link, it has no fill to darken, so its feedback has to come from a wash behind
      // the label. Without one the brightness fallback would run on a transparent background
      // and the button would look inert.
      hoverBackgroundColor: mode === 'light' ? CourierColors.black[500_10] : CourierColors.white[500_10],
      activeBackgroundColor: mode === 'light' ? CourierColors.black[500_20] : CourierColors.white[500_20]
    };
  },

  /** Reads as an inline hyperlink rather than a button — no fill, no border, no padding. */
  link: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: 'transparent',
      textColor: theme[mode].colors.primary,
      fontWeight: '500',
      border: 'none',
      shadow: 'none',
      padding: '0px',
      textDecoration: 'underline',
      // A link has no fill to darken, so its feedback has to come from a wash behind the text.
      hoverBackgroundColor: mode === 'light' ? CourierColors.black[500_10] : CourierColors.white[500_10],
      activeBackgroundColor: mode === 'light' ? CourierColors.black[500_20] : CourierColors.white[500_20]
    };
  }
} as const;

export class CourierButton extends CourierSystemThemeElement {

  static get id(): string {
    return 'courier-button';
  }

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

    // Add click handler with prevent default and stop propagation
    this._button.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.onClick) {
        props.onClick();
      }
    });
  }

  private getStyles(props: CourierButtonProps): string {

    const mode = props.mode === 'system' ? this.currentSystemTheme : props.mode;

    const defaults = CourierButtonVariants[props.variant ?? 'secondary'](mode);

    // The variant's own hover pairs with the variant's own fill. Once a caller supplies a fill of
    // its own there is no matching entry to reach for, so the feedback is derived from that color
    // by dimming it — which works whatever color it turns out to be.
    const usingOwnFill = Boolean(props.backgroundColor) && props.backgroundColor !== defaults.backgroundColor;
    const hover = props.hoverBackgroundColor ?? (usingOwnFill ? undefined : (defaults as { hoverBackgroundColor?: string }).hoverBackgroundColor);
    const active = props.activeBackgroundColor ?? (usingOwnFill ? undefined : (defaults as { activeBackgroundColor?: string }).activeBackgroundColor);

    return `
      :host {
        display: inline-block;
      }

      button {
        border: none;
        border-radius: ${props.borderRadius ?? defaults.borderRadius};
        font-weight: ${props.fontWeight ?? defaults.fontWeight};
        font-family: ${props.fontFamily ?? 'inherit'};
        font-size: ${props.fontSize ?? defaults.fontSize};
        padding: ${props.padding ?? defaults.padding};
        cursor: pointer;
        width: 100%;
        height: 100%;
        background-color: ${props.backgroundColor ?? defaults.backgroundColor};
        color: ${props.textColor ?? defaults.textColor};
        border: ${props.border ?? defaults.border};
        box-shadow: ${props.shadow ?? defaults.shadow};
        text-decoration: ${props.textDecoration ?? defaults.textDecoration};
        touch-action: manipulation;
      }

      button:hover {
        ${hover ? `background-color: ${hover};` : 'filter: brightness(0.9);'}
      }

      button:active {
        ${active ? `background-color: ${active};` : 'filter: brightness(0.8);'}
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