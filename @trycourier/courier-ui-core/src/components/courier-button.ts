import { CourierComponentThemeMode, SystemThemeMode } from "../utils/system-theme-mode";
import { theme } from "../utils/theme";
import { CourierColors, shadeTowardMiddle } from "../utils/courier-colors";
import { CourierSystemThemeElement } from "./courier-system-theme-element";

export type CourierButtonVariant = 'primary' | 'secondary' | 'outlined' | 'tertiary' | 'link';

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

  /**
   * The plain button, and what an action with no style of its own renders as. Its edge is the
   * divider hairline: barely there, because the shape and the fill are doing the work. Left
   * exactly as it was — this is the look every existing action already wears, and changing it
   * would restyle every inbox in the wild.
   */
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
   * The outlined button, for `style: 'secondary'`.
   *
   * The same face as the plain button, distinguished by an edge you can actually see, and flat
   * where the plain button floats. `colors.border` would not do: it is the hairline the inbox
   * separates rows with, 1.26:1 against the surface it would outline, so an outlined action
   * would be indistinguishable from a plain one.
   *
   * The two modes need different grays to land in the same place. On white, 600 reads as a
   * quiet edge at 4.7:1; on black[500] that same value is 3.8:1 and reads louder than the button
   * it belongs to, so dark steps down to 650 (2.5:1).
   */
  outlined: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: theme[mode].colors.secondary,
      textColor: theme[mode].colors.primary,
      fontWeight: '500',
      hoverBackgroundColor: mode === 'light' ? CourierColors.gray[200] : CourierColors.gray[800],
      activeBackgroundColor: mode === 'light' ? CourierColors.gray[500] : CourierColors.gray[700],
      border: `1px solid ${mode === 'light' ? CourierColors.gray[600] : CourierColors.gray[650]}`,
      // An outline is the whole statement; a shadow underneath it would be a second one.
      shadow: 'none'
    };
  },

  /**
   * The quietest button: the same box as its siblings, drawn with nothing but its label.
   */
  tertiary: (mode: SystemThemeMode) => {
    return {
      ...baseButtonStyles,
      backgroundColor: theme[mode].colors.border,
      textColor: theme[mode].colors.primary,
      fontWeight: '500',
      border: TRANSPARENT_BORDER,
      shadow: 'none'
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
  /**
   * Kept so the button can restyle itself when the system theme flips.
   *
   * `mode: 'system'` is resolved against `currentSystemTheme` when the styles are built, which
   * is only correct at the moment it is built. Everything else in the inbox re-reads its theme
   * through the theme manager's subscription; a button had no equivalent, so an OS flip left
   * the actions — and only the actions — wearing the colors of the mode that had just ended.
   */
  private _props: CourierButtonProps;

  constructor(props: CourierButtonProps) {
    super();
    this._props = props;
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
    const ownHover = usingOwnFill ? shadeTowardMiddle(props.backgroundColor!, 0.12) : undefined;
    const ownActive = usingOwnFill ? shadeTowardMiddle(props.backgroundColor!, 0.22) : undefined;
    const hover = props.hoverBackgroundColor ?? (usingOwnFill ? ownHover : (defaults as { hoverBackgroundColor?: string }).hoverBackgroundColor);
    const active = props.activeBackgroundColor ?? (usingOwnFill ? ownActive : (defaults as { activeBackgroundColor?: string }).activeBackgroundColor);

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
    this._props = props;
    if (props.text) {
      this._button.textContent = props.text;
    }
    this._style.textContent = this.getStyles(props);
  }

  protected onSystemThemeChange(_: SystemThemeMode): void {
    // A button pinned to 'light' or 'dark' was never asking the system, so leave it alone.
    if (this._props.mode === 'system') {
      this._style.textContent = this.getStyles(this._props);
    }
  }
}