import { CourierApiUrls, getCourierApiUrls } from '../types/courier-api-urls';
import { Logger } from '../utils/logger';
import { BrandClient } from './brand-client';
import { InboxClient } from './inbox-client';
import { PreferenceClient } from './preference-client';
import { TokenClient } from './token-client';
import { Client } from './client';
import { ListClient } from './list-client';
import { TrackingClient } from './tracking-client';

export interface CourierProps {
  jwt?: string;
  publicApiKey?: string;
  userId: string;
  connectionId?: string;
  tenantId?: string;
  showLogs?: boolean;
  apiUrls?: CourierApiUrls;
}

export interface CourierClientOptions {
  readonly jwt?: string;
  readonly publicApiKey?: string;
  readonly userId: string;
  readonly connectionId?: string;
  readonly tenantId?: string;
  readonly showLogs?: boolean;
  readonly apiUrls?: CourierApiUrls;
  readonly accessToken?: string;
  readonly logger: Logger;
  readonly urls: CourierApiUrls;
}

export class CourierClient extends Client {
  public readonly tokens: TokenClient;
  public readonly brands: BrandClient;
  public readonly preferences: PreferenceClient;
  public readonly inbox: InboxClient;
  public readonly lists: ListClient;
  public readonly tracking: TrackingClient;

  constructor(props: CourierProps) {

    // Determine if we should show logs
    const showLogs = props.showLogs !== undefined ? props.showLogs : process.env.NODE_ENV === 'development';

    // Setup options with defaults
    const baseOptions = {
      ...props,
      showLogs,
      apiUrls: props.apiUrls || getCourierApiUrls(),
      accessToken: props.jwt ?? props.publicApiKey
    };

    // Attach logger and urls to options
    super({
      ...baseOptions,
      logger: new Logger(baseOptions.showLogs),
      urls: getCourierApiUrls(baseOptions.apiUrls)
    });

    // Create subclients
    this.tokens = new TokenClient(this.options);
    this.brands = new BrandClient(this.options);
    this.preferences = new PreferenceClient(this.options);
    this.inbox = new InboxClient(this.options);
    this.lists = new ListClient(this.options);
    this.tracking = new TrackingClient(this.options);

    if (!this.options.jwt && !this.options.publicApiKey) {
      this.options.logger.warn('Courier Client initialized with no authentication method. Please provide a JWT or public API key.');
    }

    // Warn about public key usage
    if (this.options.publicApiKey) {
      this.options.logger?.warn(
        'Courier Warning: Public API Keys are for testing only. Please use JWTs for production.\n' +
        'You can generate a JWT with this endpoint: https://www.courier.com/docs/reference/auth/issue-token\n' +
        'This endpoint should be called from your backend server, not the SDK.'
      );
    }

    // Check for both keys
    if (this.options.jwt && this.options.publicApiKey) {
      this.options.logger?.warn(
        'Courier Warning: Both a JWT and a Public API Key were provided. The Public API Key will be ignored.'
      );
    }

  }

}
