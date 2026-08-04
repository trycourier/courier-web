import { NextResponse } from 'next/server';

/**
 * Returns the internal (non-public) API environments the inbox demo can target.
 *
 * These are kept OUT of this public repo. They are read from the server
 * `INTERNAL_API_ENVIRONMENTS` env var (a JSON array) — set locally via the
 * designer `.env`, and via the hosting platform's env (e.g. Vercel / GitHub
 * secrets) when deployed. Public production URLs stay hard-coded on the client.
 *
 * Env var shape:
 *   INTERNAL_API_ENVIRONMENTS=[
 *     {"id":"staging","label":"Staging","apiUrls":{
 *        "courier":{"rest":"...","graphql":"..."},
 *        "inbox":{"graphql":"...","webSocket":"..."}}},
 *     ...
 *   ]
 */

interface CourierApiUrls {
  courier: { rest: string; graphql: string };
  inbox: { graphql: string; webSocket: string };
}

interface EnvironmentOption {
  id: string;
  label: string;
  apiUrls: CourierApiUrls;
}

function isValidApiUrls(value: unknown): value is CourierApiUrls {
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

export async function GET() {
  const raw = process.env.INTERNAL_API_ENVIRONMENTS;
  let environments: EnvironmentOption[] = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        environments = parsed
          .filter(
            (e): e is EnvironmentOption =>
              e && typeof e.id === 'string' && isValidApiUrls(e.apiUrls)
          )
          .map((e) => ({
            id: e.id,
            label: typeof e.label === 'string' && e.label ? e.label : e.id,
            apiUrls: e.apiUrls,
          }));
      }
    } catch {
      // Invalid JSON — return no internal environments rather than 500ing.
    }
  }

  return NextResponse.json({ environments });
}
