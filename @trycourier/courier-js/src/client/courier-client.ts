import { CourierApiUrls, getCourierApiUrls } from '../types/courier-api-urls';
import { BrandClient } from './brand-client';
import { PreferenceClient } from './preference-client';
import { TokenClient } from './token-client';

export interface CourierClientOptions {
  jwt?: string;
  publicApiKey?: string;
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

    // Warn about public key usage
    if (this.options.publicApiKey) {
      console.warn(
        'CourierClient Warning: Public API Keys are for testing only. Please use JWTs for production.' +
        'You can generate a JWT with this endpoint: https://www.courier.com/docs/reference/auth/issue-token' +
        'This endpoint should be called from your backend server, not the SDK.'
      );
    }

  }

}
