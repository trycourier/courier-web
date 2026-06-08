/**
 * Single source of truth for the hosted-preferences token format and its base64
 * encoding. The encode/decode helpers are isomorphic — they produce the same
 * bytes in the browser (the tester page) and in node (the server pages), and are
 * byte-for-byte compatible with the backend's `Buffer.from(str, "utf8").toString(
 * "base64")` (`backend/lib/generate-tracking-links.ts`). Plain `btoa` is not a
 * substitute: it throws / corrupts on characters above U+00FF.
 */

export function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function decodeBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Builds the canonical hosted-preferences token consumed by the backend's
 * `GET /p/{encodedId}` route. Mirrors `generateHostedPreferencesLink`: the
 * `accountId` segment is only appended when non-empty.
 *
 * Format: `workspaceId#brandId#userId#draft[#accountId]`
 */
export function buildPreferencesToken(p: {
  workspaceId: string;
  brandId: string;
  userId: string;
  draft: boolean;
  accountId: string;
}): string {
  const base = `${p.workspaceId}#${p.brandId}#${p.userId}#${p.draft}`;
  return encodeBase64(p.accountId ? `${base}#${p.accountId}` : base);
}
