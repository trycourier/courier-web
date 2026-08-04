/**
 * Server-side view of the API environments the inbox demo can target, and the
 * credential that belongs to each one.
 *
 * The internal (non-public) environments are read from the server
 * `INTERNAL_API_ENVIRONMENTS` env var — set locally via the designer `.env`, and
 * via the hosting platform's env when deployed — so their hostnames and tokens
 * never land in this public repo.
 *
 * Env var shape (`authToken` optional; omit it to use `COURIER_AUTH_TOKEN`):
 *   INTERNAL_API_ENVIRONMENTS=[
 *     {"id":"staging","label":"Staging","authToken":"pk_…","apiUrls":{
 *        "courier":{"rest":"...","graphql":"..."},
 *        "inbox":{"graphql":"...","webSocket":"..."}}},
 *     ...
 *   ]
 *
 * This module must stay server-only: it reads auth tokens. The `/api/env-urls`
 * route deliberately strips `authToken` before responding.
 */

export interface EnvironmentApiUrls {
  courier: { rest: string; graphql: string };
  inbox: { graphql: string; webSocket: string };
}

export interface InternalEnvironment {
  id: string;
  label: string;
  apiUrls: EnvironmentApiUrls;
  /** Credential for this environment. Never sent to the client. */
  authToken?: string;
}

/**
 * REST bases for the public environments, whose credential is the default
 * `COURIER_AUTH_TOKEN`. Mirrors `API_ENVIRONMENT_PRESETS` in
 * `app/lib/api-urls.ts`, which is the client-side source of truth — duplicated
 * rather than imported so a server route never pulls in the client module.
 */
const PUBLIC_COURIER_REST_URLS = [
  'https://api.courier.com',
  'https://api.eu.courier.com',
];

function isValidApiUrls(value: unknown): value is EnvironmentApiUrls {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  const courier = v.courier as Record<string, unknown> | undefined;
  const inbox = v.inbox as Record<string, unknown> | undefined;
  return (
    !!courier &&
    typeof courier.rest === 'string' &&
    typeof courier.graphql === 'string' &&
    !!inbox &&
    typeof inbox.graphql === 'string' &&
    typeof inbox.webSocket === 'string'
  );
}

/**
 * Parses `INTERNAL_API_ENVIRONMENTS`, dropping malformed entries.
 *
 * Deliberately not cached: this is a handful of bytes of JSON per request, and a
 * cache would serve a stale list after the env changes.
 */
export function parseInternalEnvironments(): InternalEnvironment[] {
  const raw = process.env.INTERNAL_API_ENVIRONMENTS;
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Invalid JSON — behave as if no internal environments were configured
    // rather than failing every request.
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (e): e is InternalEnvironment =>
        e && typeof e.id === 'string' && isValidApiUrls(e.apiUrls)
    )
    .map((e) => ({
      id: e.id,
      label: typeof e.label === 'string' && e.label ? e.label : e.id,
      apiUrls: e.apiUrls,
      authToken: typeof e.authToken === 'string' ? e.authToken.trim() : undefined,
    }));
}

const normalizeBase = (url: string): string =>
  url.trim().replace(/\/+$/, '').toLowerCase();

/**
 * Picks the credential to use for a request against `courierRest`.
 *
 * An explicit `apiKey` from the caller always wins — that's the `?apiKey=`
 * override, and it's how the Custom environment reaches an arbitrary host.
 *
 * Otherwise the server is about to spend one of *its own* credentials, so
 * `courierRest` must be an environment we recognize. Refusing unknown hosts
 * keeps this route from being used to send `COURIER_AUTH_TOKEN` somewhere it
 * doesn't belong — the designer is deployed publicly, so these routes take
 * their target URL from untrusted input.
 */
export function resolveApiKey(courierRest: string | undefined, apiKey?: string): string {
  if (apiKey) {
    return apiKey;
  }

  const base = normalizeBase(courierRest || PUBLIC_COURIER_REST_URLS[0]);

  if (PUBLIC_COURIER_REST_URLS.some((url) => normalizeBase(url) === base)) {
    const token = process.env.COURIER_AUTH_TOKEN;
    if (!token) {
      throw new Error('COURIER_AUTH_TOKEN environment variable is not set');
    }
    return token;
  }

  const environment = parseInternalEnvironments().find(
    (e) => normalizeBase(e.apiUrls.courier.rest) === base
  );

  if (!environment) {
    throw new Error(
      `Unrecognized API URL "${courierRest}". Pass an explicit apiKey to use a custom environment.`
    );
  }

  if (!environment.authToken) {
    throw new Error(
      `No auth token configured for the "${environment.label}" environment. ` +
        `Add an "authToken" to its INTERNAL_API_ENVIRONMENTS entry, or pass an explicit apiKey.`
    );
  }

  return environment.authToken;
}
