/** Returns true when the given hex color looks dark (relative luminance < 0.5). */
export function isDarkColor(color: string): boolean {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return true;
  let v = match[1];
  if (v.length === 3) v = v.split('').map(c => c + c).join('');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

/**
 * Move a hex color toward the opposite end of the scale by `amount` (0-1).
 *
 * Dimming is only feedback when there is brightness to remove. A near-black fill has none, so
 * `filter: brightness()` leaves it looking inert — the case a template hits whenever it carries
 * its own dark color into dark mode. Lightening a dark color and darkening a light one gives a
 * step that is visible whichever end the fill sits at. Returns undefined for anything that is
 * not hex, leaving the caller on its own fallback.
 */
export function shadeTowardMiddle(color: string, amount: number): string | undefined {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return undefined;

  let v = match[1];
  if (v.length === 3) v = v.split('').map(c => c + c).join('');

  const target = isDarkColor(color) ? 255 : 0;
  const channel = (offset: number): string => {
    const from = parseInt(v.substring(offset, offset + 2), 16);
    return Math.round(from + (target - from) * amount).toString(16).padStart(2, '0');
  };

  return `#${channel(0)}${channel(2)}${channel(4)}`.toUpperCase();
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
    // Between 600 and 700, for an outline that has to read against a near-black face without
    // shouting. 600 is right on white (4.7:1) but 3.8:1 on black[500], which is louder than the
    // button it outlines; 700 falls to 1.9:1 and disappears.
    650: '#585858',
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
    // Higher is darker, as elsewhere in the palette. 300 and 600 exist so a link has somewhere
    // to move on hover without leaving the blue it rests at.
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB',
    600: '#1D4ED8',
  }
};

/**
 * Default primary color used across Courier UI components (checkboxes, radios, etc.).
 * Matches the inbox primary color for consistency.
 * @public
 */
export const COURIER_DEFAULT_PRIMARY_COLOR = CourierColors.blue[500];