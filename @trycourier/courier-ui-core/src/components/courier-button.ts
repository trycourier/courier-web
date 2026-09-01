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
  hoverTextColor?: string,
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
      // The accent, not the mode's ink. A filled action is the same blue in light and dark, so
      // the button a template author picks in the designer is the button that arrives — and
      // white stays readable on it in both, which it would not be on a fill that inverted.
      backgroundColor: theme[mode].colors.accent,
      textColor: CourierColors.white[500],
      fontWeight: '500',
      // A blue fill has somewhere to go in both directions, so hover and press step through the
      // blues rather than toward the middle of the ink scale.
      hoverBackgroundColor: CourierColors.blue[600],
      activeBackgroundColor: CourierColors.blue[700],
      border: TRANSPARENT_BORDER,
      shadow: 'none'
    };
  },

  secondary: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: theme[mode].colors.secondary,
      // Outlined is the same action with its chrome turned down, so it wears the same accent —
      // as the label and the outline instead of as a fill.
      textColor: theme[mode].colors.accentText,
      fontWeight: '500',
      // The wash stays neutral. It sits behind an accent label rather than replacing it, and
      // it is opaque rather than translucent: an action can sit on a floating surface (a toast)
      // where page content would otherwise show through the overlay.
      hoverBackgroundColor: mode === 'light' ? CourierColors.gray[200] : CourierColors.gray[800],
      activeBackgroundColor: mode === 'light' ? CourierColors.gray[500] : CourierColors.gray[700],
      border: `1px solid ${theme[mode].colors.accentText}`,
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
      textColor: theme[mode].colors.accentText,
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
      // A link reads as a link: it rests at the link color rather than at the body text color
      // the buttons use for their labels.
      textColor: theme[mode].colors.link,
      fontWeight: '500',
      border: 'none',
      shadow: 'none',
      padding: '0px',
      textDecoration: 'underline',
      // A link is text, so it answers a pointer the way text does — by moving its own color, not
      // by growing a box. Naming the hover fill transparent is what keeps the brightness
      // fallback from dimming the label on top of that move.
      hoverBackgroundColor: 'transparent',
      // One step further from the page than the resting color, so the move is visible in either
      // mode. Press is left to the brightness fallback, which needs no fill to act on.
      hoverTextColor: mode === 'light' ? CourierColors.blue[600] : CourierColors.blue[300]
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

    // A recolor on hover is the link's feedback rather than an extra on top of a fill, so a
    // caller that supplies its own text color takes the variant's hover color with it.
    const usingOwnText = Boolean(props.textColor) && props.textColor !== defaults.textColor;
    const hoverText = props.hoverTextColor ?? (usingOwnText ? undefined : (defaults as { hoverTextColor?: string }).hoverTextColor);

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
        ${hoverText ? `color: ${hoverText};` : ''}
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