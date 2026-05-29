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