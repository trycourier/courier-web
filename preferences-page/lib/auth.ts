import type { AuthContext } from "./types";
import { getDevConfig } from "./dev-config";

/**
 * Server-side {@link AuthContext} for the unsubscribe flow (`/u`), which runs its
 * GraphQL queries on the server. Sourced from the env-derived dev config
 * (`COURIER_JWT` in `.env.local`) — the same JWT the preferences page uses.
 *
 * Note: production `/u` is served by the backend's own handler
 * (`backend/client-routes/unsubscribe.ts`); this env path is for the local dev
 * loop in this app.
 */
export function buildAuthContextFromEnv(): AuthContext {
  const config = getDevConfig();
  if (!config) {
    throw new Error(
      "No COURIER_JWT configured. Set it in .env.local to run the unsubscribe flow locally."
    );
  }
  return {
    apiUrl: config.apiUrl,
    jwt: config.authorization,
    clientKey: config.clientKey,
  };
}
