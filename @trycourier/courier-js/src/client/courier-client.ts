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
  jwt?: string;                // JWT token for authentication: More info at https://www.courier.com/docs/reference/auth/issue-token
  publicApiKey?: string;       // Public API key for authentication
  userId: string;              // User ID for the client. This is normally an ID that matches users in your system
  connectionId?: string;       // Inbox Websocket connection ID
  tenantId?: string;           // Tenant ID. Used for multi-tenant apps
  showLogs?: boolean;          // Flag to control logging. Logs are prefixed with [COURIER].
  apiUrls?: CourierApiUrls;    // Custom API URLs
}

export interface CourierClientOptions {
  readonly jwt?: string;                // JWT token for authentication: More info at https://www.courier.com/docs/reference/auth/issue-token
  readonly publicApiKey?: string;       // Public API key for authentication
  readonly userId: string;              // User ID for the client. This is normally an ID that matches users in your system
  readonly connectionId?: string;       // Inbox Websocket connection ID
  readonly tenantId?: string;           // Tenant ID. Used for multi-tenant apps
  readonly showLogs?: boolean;          // Flag to control logging. Logs are prefixed with [COURIER].
  readonly accessToken?: string;        // Combined authentication token (jwt or publicApiKey)
  readonly logger: Logger;              // Logger instance
  readonly apiUrls: CourierApiUrls;     // Final API URLs configuration
}

export class CourierClient extends Client {
  public readonly tokens: TokenClient;
  public readonly brands: BrandClient;
  public readonly preferences: PreferenceClient;
  public readonly inbox: InboxClient;
  public readonly lists: ListClient;
  public readonly tracking: TrackingClient;

  constructor(props: CourierProps) {

    // Determine if we should show logs based on props or environment
    const showLogs = props.showLogs !== undefined ? props.showLogs : process.env.NODE_ENV === 'development';

    // Setup base options with default values
    const baseOptions = {
      ...props,
      showLogs,
      apiUrls: props.apiUrls || getCourierApiUrls(),
      accessToken: props.jwt ?? props.publicApiKey
    };

    // Initialize base client with logger and URLs
    super({
      ...baseOptions,
      logger: new Logger(baseOptions.showLogs),
      apiUrls: getCourierApiUrls(baseOptions.apiUrls)
    });

    // Initialize all subclients with the configured options
    this.tokens = new TokenClient(this.options);
    this.brands = new BrandClient(this.options);
    this.preferences = new PreferenceClient(this.options);
    this.inbox = new InboxClient(this.options);
    this.lists = new ListClient(this.options);
    this.tracking = new TrackingClient(this.options);

    // Warn if no authentication method is provided
    if (!this.options.jwt && !this.options.publicApiKey) {
      this.options.logger.warn('Courier Client initialized with no authentication method. Please provide a JWT or public API key.');
    }

    // Warn about using public API key in production
    if (this.options.publicApiKey) {
      this.options.logger?.warn(
        'Courier Warning: Public API Keys are for testing only. Please use JWTs for production.\n' +
        'You can generate a JWT with this endpoint: https://www.courier.com/docs/reference/auth/issue-token\n' +
        'This endpoint should be called from your backend server, not the SDK.'
      );
    }

    // Warn if both authentication methods are provided
    if (this.options.jwt && this.options.publicApiKey) {
      this.options.logger?.warn(
        'Courier Warning: Both a JWT and a Public API Key were provided. The Public API Key will be ignored.'
      );
    }

  }

}
