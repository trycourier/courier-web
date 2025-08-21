import { Telemetry as TelemetryInterface, BROWSER_USER_AGENT_KEY, SDK_KEY, SDK_VERSION_KEY, CLIENT_ID_KEY } from "../types/socket/protocol/telemetry";

export class Telemetry {
  private static readonly JS_SDK_NAME: string = "courier-js";

  // Package version is inlined at build time from package.json
  private static readonly JS_SDK_VERSION: string = __PACKAGE_VERSION__;

  private _clientId: string;
  private _callerSdkName?: string;
  private _callerSdkVersion?: string;

  constructor(clientId: string) {
    this._clientId = clientId;
  }

  public toWireFormat(): TelemetryInterface {
    return {
      [BROWSER_USER_AGENT_KEY]: Telemetry.getEncodedUserAgent(),
      [SDK_KEY]: this.sdkName,
      [SDK_VERSION_KEY]: this.sdkVersion,
      [CLIENT_ID_KEY]: this._clientId
    };
  }

  public set callerSdkName(sdkName: string) {
    this._callerSdkName = sdkName;
  }

  public set callerSdkVersion(sdkVersion: string) {
    this._callerSdkVersion = sdkVersion;
  }

  private get sdkName(): string {
    if (this._callerSdkName) {
      return this._callerSdkName;
    }

    return Telemetry.JS_SDK_NAME;
  }

  private get sdkVersion(): string {
    if (this._callerSdkVersion) {
      return this._callerSdkVersion;
    }

    return Telemetry.JS_SDK_VERSION;
  }

  private static getEncodedUserAgent() {
    return encodeURIComponent(window.navigator.userAgent);
  }
}
