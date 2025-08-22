import { CourierUserAgent as TelemetryInterface, BROWSER_USER_AGENT_KEY, SDK_KEY, SDK_VERSION_KEY, CLIENT_ID_KEY } from "../types/courier-user-agent";

export class CourierUserAgent {
  private static readonly HTTP_HEADER_KEY: string = "x-courier-user-agent";

  /** Client ID for this session. */
  private clientId: string;

  /**
   * Implementing SDK name.
   *
   * Present if courier-js is used as a dependency in another Courier SDK. */
  private sdkName: string;

  /**
   * Implementing SDK version.
   *
   * Present if courier-js is used as a dependency in another Courier SDK.
   */
  private sdkVersion: string;

  constructor(clientId: string, callerSdkName: string, callerSdkVersion: string) {
    this.clientId = clientId;
    this.sdkName = callerSdkName;
    this.sdkVersion = callerSdkVersion;
  }

  /** Get the telemetry payload as a JSON-serializable object. */
  public toJsonSerializable(): TelemetryInterface {
    return {
      [BROWSER_USER_AGENT_KEY]: CourierUserAgent.getEncodedUserAgent(),
      [SDK_KEY]: this.sdkName,
      [SDK_VERSION_KEY]: this.sdkVersion,
      [CLIENT_ID_KEY]: this.clientId
    };
  }

  public toHttpHeaderValue(): string {
    return Object.entries(this.toJsonSerializable())
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
  }

  /** Get the url-encoded user agent string from the browser. */
  private static getEncodedUserAgent() {
    return encodeURIComponent(window.navigator.userAgent);
  }
}
