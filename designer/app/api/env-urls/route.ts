import { NextResponse } from 'next/server';
import { parseInternalEnvironments } from '@/app/api/lib/internal-environments';

/**
 * Returns the internal (non-public) API environments the inbox demo can target,
 * so the client can drive the env switcher without those hostnames living in
 * this public repo. See `app/api/lib/internal-environments.ts` for the shape of
 * the `INTERNAL_API_ENVIRONMENTS` env var this reads.
 */
export async function GET() {
  // `authToken` is deliberately omitted: the client never needs a workspace
  // credential. The server attaches the right one per environment when it
  // handles /api/jwt and /api/messages.
  const environments = parseInternalEnvironments().map(({ id, label, apiUrls }) => ({
    id,
    label,
    apiUrls,
  }));

  return NextResponse.json({ environments });
}
