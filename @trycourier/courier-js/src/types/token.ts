export interface CourierDevice {
  appId?: string;
  adId?: string;
  deviceId?: string;
  platform?: string;
  manufacturer?: string;
  model?: string;
}

export interface CourierToken {
  provider_key: string;
  device: CourierDevice;
}