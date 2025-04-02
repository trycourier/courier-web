export interface CourierBrandResponse {
  data: CourierBrandData;
}

export interface CourierBrandData {
  brand: CourierBrand;
}

export interface CourierBrand {
  settings?: CourierBrandSettings;
}

export interface CourierBrandSettings {
  colors?: CourierBrandColors;
  inapp?: CourierBrandInApp;
}

export interface CourierBrandColors {
  primary?: string;
}

export interface CourierBrandInApp {
  disableCourierFooter?: boolean;
}

