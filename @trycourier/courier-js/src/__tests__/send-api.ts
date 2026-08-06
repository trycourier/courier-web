import { CourierClient } from '../client/courier-client';
import { InboxMessage } from '../types/inbox';
import { env } from './utils';

/**
 * Server-side helpers for the send end-to-end suite.
 *
 * Everything in here talks to the Courier REST API with a workspace auth token —
 * the half of an end-to-end send that a browser SDK deliberately cannot do. The
 * SDK's own half (reading the delivered message out of the inbox) stays in the
 * test file, so it is obvious which assertions exercise the published package.
 */

/** Credentials and fixture ids the send suite needs on top of the other suites'. */
export interface SendE2ECredentials {
  /** Workspace auth token, used for `POST /send` and for minting the user JWTs. */
  apiKey: string;
  /**
   * A user that belongs to **no** tenant.
   *
   * A send to a user who belongs to exactly one tenant is auto-scoped to it, so the
   * "send to a user" case needs a tenant-less recipient for `accountId` to reflect the
   * recipient shape under test rather than the recipient's membership.
   */
  userId: string;
  /** A user that belongs to {@link tenantId}. */
  tenantUserId: string;
  /** The tenant {@link tenantUserId} belongs to. */
  tenantId: string;
  /** A classic ("v1") notification template that routes to the inbox channel. */
  templateV1Id: string;
  /** A notification ("v2") template that routes to the inbox channel. */
  templateV2Id: string;
  restUrl: string;
}

/**
 * Reads the send-suite credentials, or returns `null` when they are not configured.
 *
 * Unlike the read-only suites, this one spends a workspace token, so it opts out rather
 * than failing when its secrets are absent — a fork or a contributor without the token
 * still gets a green courier-js run.
 */
export function sendE2ECredentials(): SendE2ECredentials | null {
  const apiKey = process.env.COURIER_E2E_API_KEY;
  const userId = process.env.COURIER_E2E_USER_ID;
  const tenantUserId = process.env.COURIER_E2E_TENANT_USER_ID;
  const tenantId = process.env.COURIER_E2E_TENANT_ID;
  const templateV1Id = process.env.COURIER_E2E_TEMPLATE_V1_ID;
  const templateV2Id = process.env.COURIER_E2E_TEMPLATE_V2_ID;

  if (!apiKey || !userId || !tenantUserId || !tenantId || !templateV1Id || !templateV2Id) {
    return null;
  }

  return {
    apiKey,
    userId,
    tenantUserId,
    tenantId,
    templateV1Id,
    templateV2Id,
    restUrl: env('COURIER_REST_URL'),
  };
}

async function request(
  credentials: SendE2ECredentials,
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  const response = await fetch(`${credentials.restUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${credentials.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${method} ${path} failed with ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

/** Mints the user JWT the SDK client authenticates with, the same way a customer's backend would. */
export async function issueUserToken(
  credentials: SendE2ECredentials,
  userId: string
): Promise<string> {
  const response = (await request(credentials, 'POST', '/auth/issue-token', {
    scope: `user_id:${userId} read:messages inbox:read:messages inbox:write:events`,
    expires_in: '1h',
  })) as { token?: string };

  if (!response?.token) {
    throw new Error(`auth/issue-token returned no token for ${userId}`);
  }

  return response.token;
}

/** Submits a message to the Send API and returns its request id. */
export async function sendMessage(
  credentials: SendE2ECredentials,
  message: unknown
): Promise<string> {
  const response = (await request(credentials, 'POST', '/send', { message })) as {
    requestId?: string;
  };

  if (!response?.requestId) {
    throw new Error(`send returned no requestId: ${JSON.stringify(response)}`);
  }

  return response.requestId;
}

/**
 * A correlation tag for one send.
 *
 * The Send API caps tags at 30 characters, and the inbox can be filtered by tag, which
 * makes a short random tag the cheapest way to find *this* send's message — a tenant
 * send fans out to a per-recipient message id the sender never sees, so the request id
 * alone can't identify it.
 */
export function correlationTag(): string {
  return `e2e-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

/** A promise resolved from the outside — here, by a socket listener. */
export function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Reads the click tracking id off a message the way the UI SDKs do.
 *
 * A message pushed over the realtime socket has no top-level `trackingIds` — the ids only
 * appear nested under `data.trackingIds`. Messages loaded through the messages query
 * expose the top-level field instead. iOS, Android and courier-ui-inbox all read `data`
 * first and fall back, so the SDKs agree on which id they send; this does the same.
 */
export function clickTrackingId(message: InboxMessage): string | undefined {
  return message.data?.trackingIds?.clickTrackingId ?? message.trackingIds?.clickTrackingId;
}

/**
 * Polls the inbox through the SDK until the message carrying `tag` shows up.
 *
 * Delivery is asynchronous: the Send API only acknowledges the request, and the message
 * lands in the inbox some seconds later. Latency is normally ~5s, but the tail is long and
 * heavy — messages the Send API reported as `SENT` within seconds have taken minutes to
 * become readable. The lag is in the message itself, not the tag index: polling unfiltered
 * and matching locally arrives at the same time, so there is no faster query to use.
 *
 * Hence the generous budget here, and the concurrent polling in the suite — waiting on
 * nine sends one after another would multiply that tail by nine.
 */
export async function waitForTaggedInboxMessage(
  client: CourierClient,
  tag: string,
  timeoutMs = 360_000
): Promise<InboxMessage> {
  const intervalMs = 2_000;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const response = await client.inbox.getMessages({
      filter: { tags: [tag] },
      paginationLimit: 10,
    });

    const message = response.data?.messages?.nodes?.[0];
    if (message) {
      return message;
    }

    if (Date.now() >= deadline) {
      throw new Error(
        `No inbox message tagged "${tag}" arrived within ${timeoutMs}ms` +
          `${client.options.tenantId ? ` (tenant "${client.options.tenantId}")` : ''}.`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
