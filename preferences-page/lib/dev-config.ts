import type { CourierConfig, CourierEnv } from "./types";
import { getApiUrls } from "./api-urls";
import { encodeBase64 } from "./token";

/**
 * Builds a {@link CourierConfig} from `.env.local` for the local dev loop. In
 * production the backend injects `window.courierConfig` and this is unused; here
 * it lets you drop a pre-minted client JWT into `.env.local` and have `/p` load
 * immediately — no tester, no API key, no signing.
 *
 * Env vars:
 *   COURIER_JWT       (required)  pre-minted user-scoped client JWT
 *   COURIER_ENV       (optional)  dev | staging | production  (default: dev)
 *   COURIER_API_URL   (optional)  override the GraphQL host (…/client/q derived)
 *   COURIER_BRAND_ID  (optional)
 *   COURIER_TENANT_ID (optional)  multi-tenant account id
 *   COURIER_DRAFT     (optional)  "true" to render the draft page
 *
 * `userId` and the workspace id (→ `clientKey`) are decoded from the JWT's own
 * claims, so `COURIER_JWT` alone is enough to get going.
 *
 * Returns null when `COURIER_JWT` is unset. Server-only — never bundled to the
 * client, so the JWT never leaks into shipped JS.
 */
export function getDevConfig(): CourierConfig | null {
  const jwt = process.env.COURIER_JWT?.trim();
  if (!jwt) return null;

  const claims = decodeJwtClaims(jwt);
  const userId = claims.userId;
  const workspaceId = claims.workspaceId;
  if (!userId || !workspaceId) {
    throw new Error(
      "COURIER_JWT is missing `scope: user_id:<id>` or `tenant_id` claims; " +
        "cannot derive userId / workspace."
    );
  }

  const env = parseEnv(process.env.COURIER_ENV);
  const apiUrl = resolveApiUrl(env);

  return {
    authorization: jwt,
    userId,
    brandId: process.env.COURIER_BRAND_ID?.trim() ?? "",
    clientKey: encodeBase64(workspaceId),
    apiUrl,
    tenantId: process.env.COURIER_TENANT_ID?.trim() ?? "",
    preferencePageDraftMode: process.env.COURIER_DRAFT === "true",
  };
}

function resolveApiUrl(env: CourierEnv): string {
  const override = process.env.COURIER_API_URL?.trim();
  if (override) return `${override.replace(/\/+$/, "")}/client/q`;
  return getApiUrls(env).courier.graphql;
}

function parseEnv(raw: string | undefined): CourierEnv {
  if (raw === "staging" || raw === "production" || raw === "dev") return raw;
  return "dev";
}

/** Decode a JWT payload (no signature verification — just reading claims). */
function decodeJwtClaims(jwt: string): { userId?: string; workspaceId?: string } {
  const payload = jwt.split(".")[1];
  if (!payload) return {};
  const json = Buffer.from(
    payload.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8");
  const claims = JSON.parse(json) as { scope?: string; tenant_id?: string };
  const userId = claims.scope?.startsWith("user_id:")
    ? claims.scope.slice("user_id:".length)
    : undefined;
  return { userId, workspaceId: claims.tenant_id };
}
