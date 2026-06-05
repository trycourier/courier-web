import type { AuthContext, CourierEnv } from "./types";

const API_BASES: Record<CourierEnv, string> = {
  production: "https://api.courier.com",
  staging: "https://api.staging-trycourier.com",
  dev: "https://api.courierdev.com",
};

function getApiBase(env: CourierEnv): string {
  return process.env.COURIER_API_URL || API_BASES[env];
}

async function issueToken(
  apiKey: string,
  userId: string,
  env: CourierEnv
): Promise<string> {
  const key = apiKey || process.env.COURIER_API_KEY;
  if (!key) {
    throw new Error(
      "No API key available. Either pass it via the URL or set COURIER_API_KEY."
    );
  }

  // The CourierPreferences component reads the preference page + brand and
  // writes preference updates, so the token needs those scopes (the legacy
  // hand-built page only needed `user_id:`). Matches designer's /api/jwt scope.
  const scope = [
    `user_id:${userId}`,
    "read:preferences",
    "write:preferences",
    "read:brands",
  ].join(" ");

  const res = await fetch(`${getApiBase(env)}/auth/issue-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      scope,
      expires_in: "1h",
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to issue token: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  return data.token;
}

export async function buildAuthContext(
  workspaceId: string,
  userId: string,
  apiKey: string = "",
  env: CourierEnv = "production"
): Promise<AuthContext> {
  const jwt = await issueToken(apiKey, userId, env);
  const clientKey = Buffer.from(workspaceId).toString("base64");

  return {
    apiUrl: `${getApiBase(env)}/client/q`,
    jwt,
    clientKey,
  };
}
