import type { AuthContext, CourierEnv, HostedPreferencesAuth } from "./types";
import { buildPreferencesToken, encodeBase64 } from "./token";

const API_BASES: Record<CourierEnv, string> = {
  production: "https://api.courier.com",
  staging: "https://api.staging-trycourier.com",
  dev: "https://api.courierdev.com",
};

function getApiBase(env: CourierEnv): string {
  return process.env.COURIER_API_URL || API_BASES[env];
}

function extractString(html: string, key: string): string | undefined {
  // window.courierConfig fields look like: authorization: "<value>",
  const match = html.match(new RegExp(`${key}:\\s*"([^"]*)"`));
  return match?.[1];
}

function extractBoolean(html: string, key: string): boolean {
  const match = html.match(new RegExp(`${key}:\\s*(true|false)`));
  return match?.[1] === "true";
}

/**
 * Fetches a hosted-preferences JWT the same way the production page does:
 * by delegating to the backend's public `GET /p/{encodedId}` route
 * (`backend/client-routes/hosted-preferences.ts`). That Lambda looks the
 * workspace's published API key up from DynamoDB and mints the JWT server-side,
 * then returns it inline on `window.courierConfig`. We re-render the freshly
 * minted JWT with the new `<CourierPreferences>` component.
 *
 * This requires no local API key and works for any workspace — exactly like the
 * existing hosted page, because it IS the existing page's auth. We forward the
 * original `encodedId` untouched; the backend reads only the first five segments
 * (`workspaceId#brandId#userId#draft#accountId`) and ignores any extra ones the
 * tester appends.
 */
export async function fetchHostedPreferencesAuth(
  encodedId: string,
  env: CourierEnv
): Promise<HostedPreferencesAuth> {
  const url = `${getApiBase(env)}/p/${encodeURIComponent(encodedId)}`;
  const res = await fetch(url, { headers: { Accept: "text/html" } });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Hosted preferences endpoint returned ${res.status} ${res.statusText}${
        detail ? ` — ${detail.slice(0, 200)}` : ""
      } (${url})`
    );
  }

  const html = await res.text();
  const jwt = extractString(html, "authorization");
  const userId = extractString(html, "userId");

  if (!jwt || !userId) {
    throw new Error(
      `Could not parse a JWT from the hosted preferences response (${url}). ` +
        "The workspace or token may be invalid."
    );
  }

  return {
    jwt,
    userId,
    brandId: extractString(html, "brandId") || undefined,
    tenantId: extractString(html, "tenantId") || undefined,
    draft: extractBoolean(html, "preferencePageDraftMode"),
  };
}

/**
 * Builds an {@link AuthContext} for the unsubscribe flow using the same hosted
 * JWT the preferences page relies on: it mints a canonical `/p/` token and
 * delegates to {@link fetchHostedPreferencesAuth}, so the backend signs the
 * user-scoped JWT from the workspace's stored key. No local API key required.
 */
export async function buildAuthContext(
  workspaceId: string,
  brandId: string,
  userId: string,
  accountId: string = "",
  env: CourierEnv = "production"
): Promise<AuthContext> {
  const encodedId = buildPreferencesToken({
    workspaceId,
    brandId,
    userId,
    draft: false,
    accountId,
  });
  const { jwt } = await fetchHostedPreferencesAuth(encodedId, env);

  return {
    apiUrl: `${getApiBase(env)}/client/q`,
    jwt,
    clientKey: encodeBase64(workspaceId),
  };
}
