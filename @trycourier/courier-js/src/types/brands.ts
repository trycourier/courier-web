import { Paging } from "./pagination";

export interface CourierBrand {
  id: string;
  name: string;
  created: number;
  updated: number;
  published: number;
  version: string;
  settings?: CourierBrandSettings;
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

export interface CourierBrandsResponse {
  paging: Paging;
  results: CourierBrand[];
}
