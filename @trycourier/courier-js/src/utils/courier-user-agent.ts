import { CourierUserAgent as TelemetryInterface, SDK_KEY, SDK_VERSION_KEY, CLIENT_ID_KEY } from "../types/courier-user-agent";

/** Client info reportable to the Courier backend in WebSocket and HTTP requests. */
export class CourierUserAgent {
  /** Client ID for this session. */
  private clientId: string;

  /** Identifier of the SDK making requests to the Courier backend. */
  private sdkName: string;

  /** Version of the SDK making requests to the Courier backend. */
  private sdkVersion: string;

  constructor(clientId: string, callerSdkName: string, callerSdkVersion: string) {
    this.clientId = clientId;
    this.sdkName = callerSdkName;
    this.sdkVersion = callerSdkVersion;
  }

  /** Get the telemetry payload as a JSON-serializable object. */
  public toJsonSerializable(): TelemetryInterface {
    return {
      [SDK_KEY]: this.sdkName,
      [SDK_VERSION_KEY]: this.sdkVersion,
      [CLIENT_ID_KEY]: this.clientId
    };
  }

  /** Get the telemetry payload as a comma-separated string, where keys and values are joined by `=`. */
  public toHttpHeaderValue(): string {
    return Object.entries(this.toJsonSerializable())
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
  }
}
