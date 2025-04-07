import { CourierApiUrls, getCourierApiUrls } from '../types/courier-api-urls';
import { BrandClient } from './brand-client';
import { Client } from './client';
import { InboxClient } from './inbox-client';
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

export class CourierClient extends Client {

  public readonly tokens: TokenClient;
  public readonly brands: BrandClient;
  public readonly preferences: PreferenceClient;
  public readonly inbox: InboxClient;

  constructor(options: CourierClientOptions) {

    // Setup options with defaults
    super({
      ...options,
      showLogs: options.showLogs || process.env.NODE_ENV === 'development',
      apiUrls: options.apiUrls || getCourierApiUrls()
    });

    // Create subclients
    this.tokens = new TokenClient(this.options);
    this.brands = new BrandClient(this.options);
    this.preferences = new PreferenceClient(this.options);
    this.inbox = new InboxClient(this.options);

    // Warn about public key usage
    if (this.options.publicApiKey) {
      this.logger.warn(
        'Courier Warning: Public API Keys are for testing only. Please use JWTs for production.\n' +
        'You can generate a JWT with this endpoint: https://www.courier.com/docs/reference/auth/issue-token\n' +
        'This endpoint should be called from your backend server, not the SDK.'
      );
    }

    // Check for both keys
    if (this.options.jwt && this.options.publicApiKey) {
      this.logger.warn(
        'Courier Warning: Both a JWT and a Public API Key were provided. The Public API Key will be ignored.'
      );
    }

  }

}
