/**
 * Returns true when the given hex color looks dark (sRGB relative luminance < 0.5).
 *
 * Uses true (gamma-decoded) relative luminance, not the quick YIQ formula: YIQ
 * misclassifies saturated mid-tone brand colors — e.g. emerald #10B981 scores
 * 0.5023 on YIQ ("light" by a rounding error, giving a black checkmark on a
 * green fill) but 0.36 in relative luminance ("dark", white checkmark), which
 * matches how such fills are perceived and the platform convention of white
 * glyphs on saturated accent colors.
 */
export function isDarkColor(color: string): boolean {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return true;
  let v = match[1];
  if (v.length === 3) v = v.split('').map(c => c + c).join('');
  const linear = (channel: number): number => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = linear(parseInt(v.substring(0, 2), 16));
  const g = linear(parseInt(v.substring(2, 4), 16));
  const b = linear(parseInt(v.substring(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
}

export const CourierColors = {
  black: {
    400: '#0A0A0A',
    500: '#171717',
    500_10: '#1717171A',
    500_20: '#17171733',
  },
  gray: {
    200: '#F5F5F5',
    400: '#3A3A3A',
    500: '#E5E5E5',
    600: '#737373',
    // Opaque equivalents of white[500_20]/white[500_10] over black[500], for
    // hover/active states on floating surfaces where a translucent overlay
    // would let page content bleed through (e.g. toasts).
    700: '#454545',
    800: '#2E2E2E',
  },
  white: {
    500: '#FFFFFF',
    500_10: '#FFFFFF1A',
    500_20: '#FFFFFF33',
  },
  blue: {
    400: '#60A5FA',
    500: '#2563EB',
  }
};

/**
 * Default primary color used across Courier UI components (checkboxes, radios, etc.).
 * Matches the inbox primary color for consistency.
 * @public
 */
export const COURIER_DEFAULT_PRIMARY_COLOR = CourierColors.blue[500];