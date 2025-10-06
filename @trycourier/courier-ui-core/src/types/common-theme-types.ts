/**
 * Common theme types that can be shared across all Courier UI packages
 */

export type CourierFontTheme = {
  family?: string;
  weight?: string;
  size?: string;
  color?: string;
}

export type CourierIconTheme = {
  color?: string;
  svg?: string;
}

export type CourierButtonTheme = {
  font?: CourierFontTheme;
  text?: string;
  shadow?: string;
  border?: string;
  borderRadius?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
}

export type CourierIconButtonTheme = {
  icon?: CourierIconTheme;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
}
