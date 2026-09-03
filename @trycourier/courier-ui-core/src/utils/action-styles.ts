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

/**
 * A color the browser can actually paint with.
 *
 * The send pipeline fills an action's `background_color` with `{brand.colors.primary}` whenever
 * the template names none, and that token only becomes a color if a brand is configured and
 * resolves. When it does not, the literal string arrives here — and being neither empty nor a
 * color, it read as an accent the author had chosen. `secondary` built
 * `1px solid {brand.colors.primary}` out of it, the browser dropped the declaration as invalid,
 * and the button lost both its outline and its label color: an unstyled ghost where an outlined
 * button belonged.
 *
 * An unresolved token is the absence of a color, so it is treated as one and the look falls back
 * to the kit's own defaults — which is what the template designer previews.
 */
function usableColor(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  // Any leftover interpolation — `{brand.colors.primary}`, `{{var}}` — that never resolved.
  return trimmed === '' || trimmed.includes('{') || trimmed.includes('}') ? undefined : trimmed;
}

/** The white background the template designer sends to mean "this button is outlined". */
const DESIGNER_OUTLINED_FILLS = new Set(['#ffffff', '#fff', 'white']);

function isDesignerOutlinedFill(backgroundColor?: string): boolean {
  return DESIGNER_OUTLINED_FILLS.has((backgroundColor ?? '').trim().toLowerCase());
}

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
  // The template designer used to have no way to say "outlined": the content API accepted only
  // `button` and `link`, so it encoded an outlined inbox button as `style: "link"` carrying a
  // white background and a black label, and read that pair back as outlined on the way in. The
  // label color is dropped before delivery, which leaves the white background as the only
  // surviving marker of what the author actually chose.
  //
  // Rendering that as a link would show an underlined phrase where the author configured a
  // button, so it is treated as the outlined look with no color of its own. Narrow on purpose —
  // a link an author wrote by hand arrives with a real color, since the send pipeline
  // substitutes the brand's primary when a template names none. The bridge is for templates
  // already saved that way; the designer says `secondary` now.
  const designerOutlined = style === 'link' && isDesignerOutlinedFill(action.background_color);

  const isLink = style === 'link' && !designerOutlined;
  const outlined = style === 'secondary' || designerOutlined;
  // The loudest of the three: a solid fill in the mode's ink, for the action that is the thing
  // to do on the message.
  const solid = style === 'tertiary';

  // The block is picked by the style's own name, so a theme and a template speak the same
  // vocabulary. An unrecognized style falls through to `button`, matching how it renders.
  const variantTheme = isLink
    ? theme?.link
    : outlined
      ? theme?.secondary
      : solid
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
      textColor: t.font?.color ?? usableColor(action.color),
      padding: t.padding ?? action.padding
    };
  }

  // The designer's white background is a marker, not a color the author picked, so it must not
  // become the outline or the label. Dropping it here leaves the button on the kit's own
  // outlined defaults, which are mode-aware — the marker carries no color that would survive a
  // dark surface anyway.
  const fill = designerOutlined ? undefined : usableColor(action.background_color);
  const borderSize = toCssLength(action.border_size ?? action.border?.size);

  // The legacy nested border is the only way an action can ask for an outline color of its own;
  // it only counts as a border when it says how thick it is, or says it is enabled.
  const legacyBorderColor = usableColor(action.border?.color);
  const legacyBorder = legacyBorderColor && (borderSize || action.border?.enabled)
    ? `${borderSize ?? '1px'} solid ${legacyBorderColor}`
    : undefined;

  // For the outlined look the action's color becomes the outline and the label rather than a
  // fill. This mirrors how the same action renders in email, the only place the style is given
  // a meaning.
  const actionBorder = outlined && fill ? `${borderSize ?? '1px'} solid ${fill}` : legacyBorder;

  // A button that draws no outline of its own still reserves the border box, so it lines up with
  // an outlined sibling in the same row.
  const ownLook = Boolean(fill || actionBorder);

  // Three weights, loudest last. `secondary` is the plain button an action has always rendered
  // as — transparent over the row, edged with the divider hairline — and it stays the default
  // so an action naming no style looks exactly as it did. `outlined` gives that edge something
  // you can see. `primary` is the solid fill, for the action that is the thing to do.
  //
  // `outlined` exists rather than `secondary` being redefined because `secondary` is a public
  // variant with its own users: an outline is what an action asks for, not a new meaning for
  // everyone else's button.
  return {
    variant: outlined ? 'outlined' : solid ? 'primary' : 'secondary',
    // The two quiet looks rest on transparent, not on the mode's surface. The list item is
    // transparent itself, so an action painted with an opaque face becomes a white chip on an
    // integrator's own background instead of sitting on it — which is what the default theme
    // did before these styles existed, and what it has to keep doing. The solid one is the
    // exception: an ink fill is the whole point of it.
    backgroundColor: solid
      ? (t.backgroundColor ?? fill)
      : outlined
        ? (t.backgroundColor ?? 'transparent')
        : (t.backgroundColor ?? fill ?? 'transparent'),
    hoverBackgroundColor: t.hoverBackgroundColor,
    activeBackgroundColor: t.activeBackgroundColor,
    border: t.border ?? actionBorder ?? (fill ? TRANSPARENT_BORDER : undefined),
    borderRadius: t.borderRadius ?? toCssLength(action.border_radius ?? action.border?.radius),
    shadow: t.shadow ?? (ownLook ? 'none' : undefined),
    textDecoration: t.textDecoration,
    fontFamily: t.font?.family,
    fontSize: t.font?.size ?? toCssLength(action.font_size),
    fontWeight: t.font?.weight,
    textColor: t.font?.color ?? usableColor(action.color) ?? (outlined ? fill : readableTextColor(fill)),
    padding: t.padding ?? action.padding
  };
}
