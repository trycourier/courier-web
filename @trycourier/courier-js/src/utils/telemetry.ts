import { Telemetry as TelemetryInterface, BROWSER_USER_AGENT_KEY, SDK_KEY, SDK_VERSION_KEY, CLIENT_ID_KEY } from "../types/socket/protocol/telemetry";

export class Telemetry {
  /** Unique identifier for this SDK. */
  private static readonly JS_SDK_NAME: string = "courier-js";

  /**
   * Version of the courier-js SDK.
   *
   * Package version is inlined at build time from package.json
   */
  private static readonly JS_SDK_VERSION: string = __PACKAGE_VERSION__;

  /** Client ID for this session. */
  private _clientId: string;

  /**
   * Implementing SDK name.
   *
   * Present if courier-js is used as a dependency in another Courier SDK. */
  private _callerSdkName?: string;

  /**
   * Implementing SDK version.
   *
   * Present if courier-js is used as a dependency in another Courier SDK.
   */
  private _callerSdkVersion?: string;

  constructor(clientId: string) {
    this._clientId = clientId;
  }

  /** Get the telemetry payload as a JSON-serializable object. */
  public toWireFormat(): TelemetryInterface {
    return {
      [BROWSER_USER_AGENT_KEY]: Telemetry.getEncodedUserAgent(),
      [SDK_KEY]: this.sdkName,
      [SDK_VERSION_KEY]: this.sdkVersion,
      [CLIENT_ID_KEY]: this._clientId
    };
  }

  /**
   * Set the identifing name of the dependent SDK using courier-js.
   *
   * Other Courier SDKs should set this to their name.
   */
  public set callerSdkName(sdkName: string) {
    this._callerSdkName = sdkName;
  }

  /**
   * Set the version of the dependent SDK using courier-js.
   *
   * Other Courier SDKs should set this to their version.
   */
  public set callerSdkVersion(sdkVersion: string) {
    this._callerSdkVersion = sdkVersion;
  }

  /** The SDK name to report in the telemetry payload. */
  private get sdkName(): string {
    if (this._callerSdkName) {
      return this._callerSdkName;
    }

    return Telemetry.JS_SDK_NAME;
  }

  /** The SDK version to report in the telemetry payload. */
  private get sdkVersion(): string {
    if (this._callerSdkVersion) {
      return this._callerSdkVersion;
    }

    return Telemetry.JS_SDK_VERSION;
  }

  /** Get the url-encoded user agent string from the browser. */
  private static getEncodedUserAgent() {
    return encodeURIComponent(window.navigator.userAgent);
  }
}
