import type { CourierEnv, DecodedParams, DecodedUnsubscribeParams } from "./types";

const VALID_ENVS = new Set<CourierEnv>(["production", "staging", "dev"]);

function parseEnv(raw: string | undefined): CourierEnv {
  if (raw && VALID_ENVS.has(raw as CourierEnv)) return raw as CourierEnv;
  return "production";
}

/**
 * Decodes the base64-encoded path parameter.
 *
 * Format: workspaceId#brandId#userId#draft#accountId#apiKey#env
 *
 * The leading `workspaceId#brandId#userId#draft` matches the backend's canonical
 * hosted-preferences token (see `generate-tracking-links.ts`). The trailing
 * `accountId#apiKey#env` segments are appended for this tester so the server can
 * mint a user JWT from the API key carried in the token. `draft` is parsed but
 * ignored (the component only renders published pages). Tokens without the
 * trailing segments still parse — the extra fields just come back empty.
 */
export function decodeParams(encodedId: string): DecodedParams {
  const decoded = Buffer.from(
    decodeURIComponent(encodedId),
    "base64"
  ).toString();
  const [workspaceId, brandId, userId, draftStr, accountId, apiKey, env] =
    decoded.split("#");

  if (!workspaceId?.trim() || !userId?.trim()) {
    throw new Error("Missing workspaceId or userId");
  }

  return {
    workspaceId,
    brandId: brandId ?? "",
    userId,
    draft: draftStr === "true",
    accountId: accountId ?? "",
    apiKey: apiKey ?? "",
    env: parseEnv(env),
  };
}

/**
 * Decodes the base64-encoded path parameter for unsubscribe pages.
 *
 * Format: workspaceId#brandId#userId#topicId#list[#accountId][#apiKey][#env]
 */
export function decodeUnsubscribeParams(encodedId: string): DecodedUnsubscribeParams {
  const decoded = Buffer.from(
    decodeURIComponent(encodedId),
    "base64"
  ).toString();
  const [workspaceId, brandId, userId, topicId, listStr, accountId, apiKey, env] =
    decoded.split("#");

  if (!workspaceId?.trim() || !userId?.trim() || !topicId?.trim()) {
    throw new Error("Missing workspaceId, userId, or topicId");
  }

  return {
    workspaceId,
    brandId: brandId ?? "",
    userId,
    topicId,
    list: listStr === "true",
    accountId: accountId ?? "",
    apiKey: apiKey ?? "",
    env: parseEnv(env),
  };
}
