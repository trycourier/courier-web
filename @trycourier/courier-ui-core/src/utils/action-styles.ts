import { CourierButtonProps, TRANSPARENT_BORDER } from "../components/courier-button";
import { CourierColors, isDarkColor } from "./courier-colors";

/**
 * The styling an Elemental `action` element can carry.
 *
 * Declared structurally rather than imported from `@trycourier/courier-js` so the core kit
 * stays free of a dependency on the data SDK. `InboxAction` satisfies it.
 */
export interface CourierActionStyle {
  background_color?: string;
  border_radius?: string;
  border_size?: string;
  font_size?: string;
  padding?: string;
  style?: string;
  color?: string;
  border?: {
    enabled?: boolean;
    color?: string;
    radius?: string | number;
    size?: string;
  };
}

/**
 * The theme values that describe one action look.
 *
 * @public
 */
export interface CourierActionVariantThemeStyle {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  textDecoration?: string;
  padding?: string;
  font?: {
    family?: string;
    size?: string;
    weight?: string;
    color?: string;
  };
}

/**
 * The theme values an integrator can set for a row of message actions.
 *
 * The top level applies to every action. Below it sits one block per `action.style`, each named
 * for the value it answers to — a theme reads the same as the template that feeds it, with no
 * mapping to remember between what a template sends and what a theme calls it. A block layers
 * over the top level, and an action's own Elemental styling still supersedes both.
 *
 * @public
 */
export interface CourierActionThemeStyle extends CourierActionVariantThemeStyle {
  /** Applies to `style: 'button'` — the filled button, and the default when a style is absent. */
  button?: CourierActionVariantThemeStyle;
  /** Applies to `style: 'secondary'` — the outlined button. */
  secondary?: CourierActionVariantThemeStyle;
  /** Applies to `style: 'tertiary'` — the borderless button. */
  tertiary?: CourierActionVariantThemeStyle;
  /** Applies to `style: 'link'` — inline text rather than a button. */
  link?: CourierActionVariantThemeStyle;
}

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function toCssLength(value: string | number | undefined): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    return `${value}px`;
  }
  // Templates written before the flat border fields stored bare pixel counts as strings.
  return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

/**
 * Pick light or dark text for a background color, whichever stays readable on it.
 *
 * Elemental has no text color on actions, so a template that sets a dark fill would otherwise
 * render dark-on-dark. Only hex is understood; anything else returns `undefined` so the caller
 * falls back to the theme.
 */
export function readableTextColor(backgroundColor?: string): string | undefined {
  if (!backgroundColor || !HEX_COLOR.test(backgroundColor.trim())) {
    return undefined;
  }

  return isDarkColor(backgroundColor) ? CourierColors.white[500] : CourierColors.black[500];
}

/**
 * Resolve the button styling for a message action.
 *
 * Precedence is the usual one: a value the integrator set on the theme wins; failing that the
 * action's own Elemental styling applies, so an untouched theme renders what the template author
 * configured; failing both, the value is left unset and `CourierButton` supplies its default.
 *
 * That ordering is what makes a theme an override rather than a suggestion — set
 * `actions.backgroundColor` and every action wears it, whatever colour the template asked for.
 * It also means the default theme deliberately says nothing about actions: a default living
 * there would outrank the template and there would be no way to tell it apart from a value the
 * integrator chose.
 */
export function courierActionButtonProps(
  action: CourierActionStyle,
  theme?: CourierActionThemeStyle
): Partial<CourierButtonProps> {

  // Nothing validates `style` in transit and its casing is preserved as sent, so match loosely
  // rather than assume the sender normalized it. An unrecognized value falls through to the
  // plain button rather than stranding the action between looks.
  const style = action.style?.trim().toLowerCase();
  const isLink = style === 'link';
  const outlined = style === 'secondary';
  // The quietest button: the same box as its siblings, drawn with nothing but its label. It is
  // still a button, so it keeps the padding and the hit area a link gives up.
  const borderless = style === 'tertiary';

  // The block is picked by the style's own name, so a theme and a template speak the same
  // vocabulary. An unrecognized style falls through to `button`, matching how it renders.
  const variantTheme = isLink
    ? theme?.link
    : outlined
      ? theme?.secondary
      : borderless
        ? theme?.tertiary
        : theme?.button;

  // Typography carries across the whole row, so a font set at the top level applies to every
  // style and the block only refines it. The rest of the base layers in for the buttons but not
  // for a link, since inheriting a fill or a border would put button chrome on something that
  // should read as text.
  const font = { ...theme?.font, ...variantTheme?.font };
  const t: CourierActionVariantThemeStyle = isLink
    ? { ...variantTheme, font }
    : { ...theme, ...variantTheme, font };

  // A link is not a button wearing different colors — none of the button chrome applies to it.
  if (isLink) {
    return {
      variant: 'link',
      backgroundColor: t.backgroundColor,
      hoverBackgroundColor: t.hoverBackgroundColor,
      activeBackgroundColor: t.activeBackgroundColor,
      border: t.border,
      borderRadius: t.borderRadius,
      shadow: t.shadow,
      textDecoration: t.textDecoration,
      fontFamily: t.font?.family,
      fontSize: t.font?.size ?? toCssLength(action.font_size),
      fontWeight: t.font?.weight,
      textColor: t.font?.color ?? action.color,
      padding: t.padding ?? action.padding
    };
  }

  const fill = action.background_color;
  const borderSize = toCssLength(action.border_size ?? action.border?.size);

  // A borderless button draws neither a fill nor an outline, so the action's color has only the
  // label left to land on. It keeps a transparent border for the same reason a plain button
  // does — the box has to match an outlined sibling in the same row.
  if (borderless) {
    return {
      variant: 'tertiary',
      backgroundColor: t.backgroundColor,
      hoverBackgroundColor: t.hoverBackgroundColor,
      activeBackgroundColor: t.activeBackgroundColor,
      border: t.border,
      borderRadius: t.borderRadius ?? toCssLength(action.border_radius ?? action.border?.radius),
      shadow: t.shadow,
      textDecoration: t.textDecoration,
      fontFamily: t.font?.family,
      fontSize: t.font?.size ?? toCssLength(action.font_size),
      fontWeight: t.font?.weight,
      textColor: t.font?.color ?? action.color ?? fill,
      padding: t.padding ?? action.padding
    };
  }

  // The legacy nested border is the only way an action can ask for an outline color of its own;
  // it only counts as a border when it says how thick it is, or says it is enabled.
  const legacyBorder = action.border?.color && (borderSize || action.border?.enabled)
    ? `${borderSize ?? '1px'} solid ${action.border.color}`
    : undefined;

  // For the outlined look the action's color becomes the outline and the label rather than a
  // fill. This mirrors how the same action renders in email, the only place the style is given
  // a meaning.
  const actionBorder = outlined && fill ? `${borderSize ?? '1px'} solid ${fill}` : legacyBorder;

  // A button that draws no outline of its own still reserves the border box, so it lines up with
  // an outlined sibling in the same row.
  const ownLook = Boolean(fill || actionBorder);

  // A filled action is the `primary` variant and an outlined one the `secondary`, so each takes
  // the right defaults when the action names no colour of its own. Both used to return
  // `secondary`, which was invisible while every action arrived carrying a fill — the send
  // pipeline substituted the brand's primary — and became visible the moment it stopped: with
  // no fill, `secondary`'s surface made a filled button and an outlined one identical.
  return {
    variant: outlined ? 'secondary' : 'primary',
    backgroundColor: outlined ? t.backgroundColor : (t.backgroundColor ?? fill),
    hoverBackgroundColor: t.hoverBackgroundColor,
    activeBackgroundColor: t.activeBackgroundColor,
    border: t.border ?? actionBorder ?? (fill ? TRANSPARENT_BORDER : undefined),
    borderRadius: t.borderRadius ?? toCssLength(action.border_radius ?? action.border?.radius),
    shadow: t.shadow ?? (ownLook ? 'none' : undefined),
    textDecoration: t.textDecoration,
    fontFamily: t.font?.family,
    fontSize: t.font?.size ?? toCssLength(action.font_size),
    fontWeight: t.font?.weight,
    textColor: t.font?.color ?? action.color ?? (outlined ? fill : readableTextColor(fill)),
    padding: t.padding ?? action.padding
  };
}
