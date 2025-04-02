import { CourierApiUrls, getCourierApiUrls } from '../types/courier-api-urls';
import { BrandClient } from './brand-client';
import { PreferenceClient } from './preference-client';
import { TokenClient } from './token-client';

export interface CourierClientOptions {
  jwt?: string;
  clientKey?: string;
  userId: string;
  connectionId?: string;
  tenantId?: string;
  showLogs?: boolean;
  apiUrls?: CourierApiUrls;
}

export class CourierClient {
  public readonly options: CourierClientOptions;
  public readonly tokens: TokenClient;
  public readonly brands: BrandClient;
  public readonly preferences: PreferenceClient;

  constructor(options: CourierClientOptions) {
    // Setup options with defaults
    this.options = {
      ...options,
      showLogs: options.showLogs || process.env.NODE_ENV === 'development',
      apiUrls: options.apiUrls || getCourierApiUrls()
    };

    // Create subclients
    this.tokens = new TokenClient(this.options);
    this.brands = new BrandClient(this.options);
    this.preferences = new PreferenceClient(this.options);
  }
}
