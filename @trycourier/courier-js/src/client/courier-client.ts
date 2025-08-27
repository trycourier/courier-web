
import { CourierApiUrls, getCourierApiUrls } from '../types/courier-api-urls';
import { Logger } from '../utils/logger';
import { BrandClient } from './brand-client';
import { InboxClient } from './inbox-client';
import { PreferenceClient } from './preference-client';
import { TokenClient } from './token-client';
import { Client } from './client';
import { ListClient } from './list-client';
import { TrackingClient } from './tracking-client';
import { UUID } from '../utils/uuid';
import { CourierUserAgent } from '../utils/courier-user-agent';

export interface CourierProps {
  /** User ID for the client. Normally matches the UID in your system */
  userId: string;

  /** JWT token for authentication: More info at https://www.courier.com/docs/reference/auth/issue-token */
  jwt?: string;

  /** Public API key for testing (use JWTs in prod) */
  publicApiKey?: string;

  /** Tenant ID. Used for multi-tenant apps */
  tenantId?: string;

  /** Flag to control logging. Logs are prefixed with [COURIER]. */
  showLogs?: boolean;

  /** Custom API URLs */
  apiUrls?: CourierApiUrls;

  /**
   * Optional: The name of the SDK calling courier-js methods.
   *
   * This is an internal prop, intended to be set by other Courier SDKs.
   * If undefined, this defaults to "courier-js".
   * @ignore
   */
  courierUserAgentName?: string;

  /**
   * Optional: The version of the SDK calling courier-js methods.
   *
   * This is an internal prop, intended to be set by other Courier SDKs.
   * If undefined, this defaults to this package's version.
   * @ignore
   */
  courierUserAgentVersion?: string;
}

export interface CourierClientOptions {
  /** JWT token for authentication: More info at https://www.courier.com/docs/reference/auth/issue-token */
  readonly jwt?: string;

  /** Public API key for testing (use JWTs in prod) */
  readonly publicApiKey?: string;

  /** User ID for the client. Normally matches the UID in your system */
  readonly userId: string;

  /** Inbox Websocket connection ID */
  readonly connectionId: string;

  /** Tenant ID. Used for multi-tenant apps */
  readonly tenantId?: string;

  /** Flag to control logging. Logs are prefixed with [COURIER]. */
  readonly showLogs?: boolean;

  /** Combined authentication token (jwt or publicApiKey) */
  readonly accessToken?: string;

  /** Logger instance */
  readonly logger: Logger;

  /** Final API URLs configuration */
  readonly apiUrls: CourierApiUrls;

  /** User agent describing Courier SDK and browser UA. */
  readonly courierUserAgent: CourierUserAgent;
}

export class CourierClient extends Client {
  /** User-agent reporting name of the courier-js package. */
  private static readonly COURIER_JS_NAME = "courier-js";

  /**
   * User agent reporting version of the courier-js package.
   * Inlined from package.json at build time.
   */
  private static readonly COURIER_JS_VERSION = __PACKAGE_VERSION__;

  public readonly tokens: TokenClient;
  public readonly brands: BrandClient;
  public readonly preferences: PreferenceClient;
  public readonly inbox: InboxClient;
  public readonly lists: ListClient;
  public readonly tracking: TrackingClient;

  constructor(props: CourierProps) {
    // Determine if we should show logs (default to false)
    const showLogs = props.showLogs !== undefined ? props.showLogs : false;
    const connectionId = UUID.nanoid();

    // Setup base options with default values
    const baseOptions = {
      ...props,
      showLogs,
      connectionId,
      apiUrls: props.apiUrls || getCourierApiUrls(),
      accessToken: props.jwt ?? props.publicApiKey
    };

    const courierUserAgent = new CourierUserAgent(
      connectionId,
      props.courierUserAgentName || CourierClient.COURIER_JS_NAME,
      props.courierUserAgentVersion || CourierClient.COURIER_JS_VERSION
    );

    // Initialize base client with logger and URLs
    super({
      ...baseOptions,
      logger: new Logger(baseOptions.showLogs),
      courierUserAgent,
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
