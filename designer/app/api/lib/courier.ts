import { Courier } from "@trycourier/courier";
import { resolveApiKey } from "@/app/api/lib/internal-environments";

/**
 * Builds a Courier client for `baseUrl`.
 *
 * The credential is chosen per environment, not global: the env switcher points
 * `baseUrl` at production/dev/staging, and each of those needs its own key. See
 * {@link resolveApiKey}.
 */
export function getCourierClient(baseUrl: string, apiKey?: string) {
  return new Courier({
    apiKey: resolveApiKey(baseUrl, apiKey),
    baseURL: baseUrl,
  });
}
