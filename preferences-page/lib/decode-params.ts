import type { CourierEnv, DecodedParams, DecodedUnsubscribeParams } from "./types";
import { decodeBase64 } from "./token";

const VALID_ENVS = new Set<CourierEnv>(["production", "staging", "dev"]);

function parseEnv(raw: string | undefined): CourierEnv {
  if (raw && VALID_ENVS.has(raw as CourierEnv)) return raw as CourierEnv;
  return "production";
}

/**
 * Decodes the base64-encoded path parameter.
 *
 * Format: workspaceId#brandId#userId#draft#accountId#env
 *
 * The leading `workspaceId#brandId#userId#draft#accountId` matches the backend's
 * canonical hosted-preferences token (see `generate-tracking-links.ts`); the
 * backend mints the JWT from the workspace's stored key. The trailing `env`
 * segment is appended for this tester to pick the API host. `draft` is parsed and
 * forwarded to the client (propagated like the backend's `preferencePageDraftMode`;
 * the CourierPreferences component does not consume it yet). Tokens without the
 * trailing segments still parse — the extra fields just come back empty.
 */
export function decodeParams(encodedId: string): DecodedParams {
  const decoded = decodeBase64(decodeURIComponent(encodedId));
  const [workspaceId, brandId, userId, draftStr, accountId, env] =
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
    env: parseEnv(env),
  };
}

/**
 * Decodes the base64-encoded path parameter for unsubscribe pages.
 *
 * Format: workspaceId#brandId#userId#topicId#list[#accountId][#env]
 */
export function decodeUnsubscribeParams(encodedId: string): DecodedUnsubscribeParams {
  const decoded = decodeBase64(decodeURIComponent(encodedId));
  const [workspaceId, brandId, userId, topicId, listStr, accountId, env] =
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
    env: parseEnv(env),
  };
}
