export interface CourierBrandLogo {
  href?: string;
  image?: string;
}

export interface CourierBrandSocialLinks {
  facebook?: { url: string };
  instagram?: { url: string };
  linkedin?: { url: string };
  medium?: { url: string };
  twitter?: { url: string };
}

export interface CourierBrand {
  id: string;
  name: string;
  created: number;
  updated: number;
  published: number;
  version: string;
  settings?: CourierBrandSettings;
  logo?: CourierBrandLogo | null;
  links?: CourierBrandSocialLinks | null;
}

export interface CourierBrandSettings {
  colors?: CourierBrandColors;
  email?: CourierBrandEmail;
  inapp?: CourierBrandInApp;
}

export interface CourierBrandColors {
  primary?: string;
  secondary?: string;
  tertiary?: string;
}

export interface CourierBrandEmail {
  header?: {
    barColor?: string;
  };
  footer?: {
    markdown?: string;
  };
  head?: {
    inheritDefault?: boolean;
  };
}

export interface CourierBrandInApp {
  borderRadius?: string;
  disableMessageIcon?: boolean;
  placement?: string;
  disableCourierFooter?: boolean;
}
