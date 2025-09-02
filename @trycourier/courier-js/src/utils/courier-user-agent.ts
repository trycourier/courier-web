import { CourierUserAgent as ICourierUserAgent, SDK_KEY, SDK_VERSION_KEY, CLIENT_ID_KEY } from "../types/courier-user-agent";

/** Client info reportable to the Courier backend in WebSocket and HTTP requests. */
export class CourierUserAgent {
  /**
   * Create User Agent info
   * @param clientId client ID for this session
   * @param sdkName identifier of the SDK making requests to the Courier backend
   * @param sdkVersion version of the SDK making requests to the Courier backend
   */
  constructor(
    private readonly clientId: string,
    private readonly sdkName: string,
    private readonly sdkVersion: string) {}

  /** Get the telemetry payload as a JSON-serializable object. */
  public getUserAgentInfo(): ICourierUserAgent {
    return {
      [SDK_KEY]: this.sdkName,
      [SDK_VERSION_KEY]: this.sdkVersion,
      [CLIENT_ID_KEY]: this.clientId
    };
  }

  /** Get the telemetry payload as a comma-separated string, where keys and values are joined by `=`. */
  public toHttpHeaderValue(): string {
    return Object.entries(this.getUserAgentInfo())
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
  }
}
