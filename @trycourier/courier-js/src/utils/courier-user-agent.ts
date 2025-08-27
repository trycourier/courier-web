import { CourierUserAgent as TelemetryInterface, SDK_KEY, SDK_VERSION_KEY, CLIENT_ID_KEY } from "../types/courier-user-agent";

export class CourierUserAgent {
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
}
