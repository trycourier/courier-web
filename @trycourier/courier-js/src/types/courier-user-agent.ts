/** HTTP Header key used to report the Courier User-Agent. */
export const HTTP_HEADER_KEY: string = "x-courier-ua" as const;

/**
 * HTTP query param key used to report the Courier User-Agent.
 *
 * Used in WebSocket Upgrade requests, where custom headers are not possible.
 */
export const HTTP_QUERY_PARAM_KEY: string = "cua" as const;

export const SDK_KEY = "sdk" as const;
export const SDK_VERSION_KEY = "sdkv" as const;
export const CLIENT_ID_KEY = "cid" as const;

/**
 * Courier User Agent object, identifying:
 *  - the SDK name and version making a request
 *  - the pseudonymous client ID, which is not connected to a user ID or workspace
 *
 * This JSON-serializable object is sent as part of WebSocket messages under
 * the `stats` key or serialized to a string HTTP header value for HTTP requests.
 */
export interface CourierUserAgent {
  [SDK_KEY]: string;
  [SDK_VERSION_KEY]: string;
  [CLIENT_ID_KEY]: string;
}
