import { type CourierApiUrls } from "@trycourier/courier-react";
import type { CourierConfig, CourierEnv } from "./types";
import { getApiUrls } from "./api-urls";

/**
 * Client-safe helpers for turning a {@link CourierConfig} into the arguments
 * `courier.shared.signIn(...)` expects. Both auth sources — `window.courierConfig`
 * (production) and the env-derived dev config — produce a `CourierConfig`, so the
 * UI has a single code path.
 */

/** Infer the environment from the GraphQL host so we can pick inbox URLs. */
function inferEnv(apiUrl: string): CourierEnv {
  if (apiUrl.includes("courierdev.com") || apiUrl.includes("/dev/")) return "dev";
  if (apiUrl.includes("staging")) return "staging";
  return "production";
}

/**
 * Build the full `CourierApiUrls` from the config's single `apiUrl` (the GraphQL
 * endpoint, `.../client/q`). The preferences component only talks to the `courier`
 * endpoints, but the type requires `inbox` too, so we borrow those from the
 * env-matched preset.
 */
export function apiUrlsFromConfig(apiUrl: string): CourierApiUrls {
  const preset = getApiUrls(inferEnv(apiUrl));
  return {
    courier: {
      rest: apiUrl.replace(/\/client\/q\/?$/, ""),
      graphql: apiUrl,
    },
    inbox: preset.inbox,
  };
}

/**
 * Resolve the config the page authenticates from, in priority order:
 *   1. `window.courierConfig` — injected by the backend HTML in production.
 *   2. `fallback` — the env-derived dev config passed from the server component.
 * Returns null when neither is present (render an error state).
 *
 * Must run client-side (reads `window`); callers invoke it from an effect.
 */
export function resolveClientConfig(
  fallback: CourierConfig | null
): CourierConfig | null {
  if (typeof window !== "undefined" && window.courierConfig) {
    return window.courierConfig;
  }
  return fallback;
}
