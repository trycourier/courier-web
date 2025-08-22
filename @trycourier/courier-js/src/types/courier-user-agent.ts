export const BROWSER_USER_AGENT_KEY = "bua" as const;
export const SDK_KEY = "sdk" as const;
export const SDK_VERSION_KEY = "sdkv" as const;
export const CLIENT_ID_KEY = "cid" as const;

/**
 * Courier User Agent object, identifying:
 *  - the SDK name and version making a request
 *  - the browser's user agent
 *  - the pseudonymous client ID, which is not connected to a user ID or workspace
 *
 * This JSON-serializable object is sent as part of WebSocket messages under
 * the `stats` key or serialized to a string HTTP header value for HTTP requests.
 */
export interface CourierUserAgent {
  [BROWSER_USER_AGENT_KEY]: string;
  [SDK_KEY]: string;
  [SDK_VERSION_KEY]: string;
  [CLIENT_ID_KEY]: string;
}
