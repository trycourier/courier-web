export const BROWSER_USER_AGENT_KEY = "bua" as const;
export const SDK_KEY = "sdk" as const;
export const SDK_VERSION_KEY = "sdkv" as const;
export const CLIENT_ID_KEY = "cid" as const;

export interface Telemetry {
  [BROWSER_USER_AGENT_KEY]: string;
  [SDK_KEY]: string;
  [SDK_VERSION_KEY]: string;
  [CLIENT_ID_KEY]: string;
}
