import { CourierClient } from '../client/courier-client';
import { InboxMessage } from '../types/inbox';
import { InboxMessageEvent } from '../types/socket/protocol/messages';
import {
  addUserToTenant,
  clickTrackingId,
  correlationTag,
  createTenant,
  deferred,
  deleteProfile,
  deleteTenant,
  issueUserToken,
  sendE2ECredentials,
  sendMessage,
  waitForTaggedInboxMessage,
  withTimeout,
} from './send-api';
import { env } from './utils';

/**
 * End-to-end sends: a message goes in through the Send API and has to come back out of
 * the inbox through this SDK — over both paths a browser uses, the messages query and the
 * realtime socket — and then be clickable.
 *
 * The matrix is every recipient shape (a user, a tenant, a user within a tenant) crossed
 * with every way of specifying content (inline content, a classic "v1" template, a "v2"
 * notification template). For each of the nine, the suite asserts that:
 *
 *   1. the message is readable via `inbox.getMessages`, correctly scoped and rendered;
 *   2. the same message is pushed over the inbox socket; and
 *   3. clicking it — with the tracking id off the socket payload, as the inbox UI does
 *      the moment a message arrives — is accepted.
 *
 * The suite provisions its own users and tenant per run, so it neither depends on nor
 * pollutes the fixtures the other suites read.
 */

const credentials = sendE2ECredentials();

// This suite provisions tenants and spends a workspace token, so it opts out when its
// secrets are absent instead of failing the whole courier-js run. See `sendE2ECredentials`.
const describeSend = credentials ? describe : describe.skip;

/**
 * Comfortably longer than the poll budgets below, so a slow delivery surfaces as their
 * descriptive error rather than a bare jest timeout.
 */
const TEST_TIMEOUT_MS = 420_000;

/** Matches `waitForTaggedInboxMessage`'s default: the socket can only be as quick as delivery. */
const SOCKET_TIMEOUT_MS = 360_000;

describeSend('Send to inbox (end to end)', () => {
  const suiteId = crypto.randomUUID().slice(0, 8);
  /** Belongs to no tenant, so its messages stay unscoped. See `recipients` below. */
  const soloUserId = `e2e-send-solo-${suiteId}`;
  const tenantUserId = `e2e-send-member-${suiteId}`;
  const tenantId = `e2e-send-tenant-${suiteId}`;

  interface Delivery {
    tag: string;
    requestId: string;
    /** The message as read back through `inbox.getMessages`. */
    message: InboxMessage;
    /** The same message as pushed over the inbox socket. */
    socketMessage: InboxMessage;
    /** The click tracking id taken off the socket payload and used for the click. */
    socketClickTrackingId: string;
  }

  /** One entry per matrix cell, keyed `<recipient>/<content>`. */
  const deliveries = new Map<string, Promise<Delivery>>();

  /** Resolved by the socket listeners, keyed by the send's correlation tag. */
  const socketMessages = new Map<string, ReturnType<typeof deferred<InboxMessage>>>();

  /** The two clients a browser would hold; created once so their sockets stay open. */
  const clients = new Map<string, CourierClient>();

  interface RecipientCase {
    name: string;
    userId: () => string;
    /** `message.to` for this recipient shape. */
    to: () => Record<string, unknown>;
    /** The tenant the reading client is signed in with, if any. */
    readTenantId: () => string | undefined;
    /** The tenant the delivered message should be scoped to, if any. */
    expectedAccountId: () => string | null;
    /** How the delivered message id relates to the request id the Send API returned. */
    expectedMessageId: (requestId: string) => string;
  }

  const recipients: RecipientCase[] = [
    {
      name: 'a user',
      // Deliberately the tenant-less user: a send to a user who belongs to exactly one
      // tenant is auto-scoped to it, which would make `accountId` depend on membership
      // rather than on the recipient shape under test.
      userId: () => soloUserId,
      to: () => ({ user_id: soloUserId }),
      readTenantId: () => undefined,
      expectedAccountId: () => null,
      expectedMessageId: (requestId) => requestId,
    },
    {
      name: 'a tenant',
      userId: () => tenantUserId,
      to: () => ({ tenant_id: tenantId }),
      readTenantId: () => tenantId,
      expectedAccountId: () => tenantId,
      // A tenant send fans out to every member, so each member's message id is the
      // request id suffixed with their user id.
      expectedMessageId: (requestId) => `${requestId}:${tenantUserId}`,
    },
    {
      name: 'a user in a tenant',
      userId: () => tenantUserId,
      // `to.tenant_id` means "send to the tenant", and the API rejects it alongside a
      // `user_id`. Targeting one user *within* a tenant is `to.context.tenant_id`.
      to: () => ({ user_id: tenantUserId, context: { tenant_id: tenantId } }),
      readTenantId: () => tenantId,
      expectedAccountId: () => tenantId,
      expectedMessageId: (requestId) => requestId,
    },
  ];

  interface ContentCase {
    name: string;
    /** The content half of the message: inline content, or a template reference. */
    message: (tag: string) => Record<string, unknown>;
    assert: (message: InboxMessage, tag: string) => void;
  }

  const contents: ContentCase[] = [
    {
      name: 'a content message',
      message: (tag) => ({
        content: {
          title: `E2E content ${tag}`,
          body: `Sent by the courier-js send e2e suite (${tag}).`,
        },
        // Inline content carries no routing of its own, so the channel has to be named
        // here. Templates bring their own routing and must not be overridden.
        routing: { method: 'single', channels: ['inbox'] },
      }),
      assert: (message, tag) => {
        expect(message.title).toBe(`E2E content ${tag}`);
        expect(message.preview).toContain(tag);
      },
    },
    {
      name: 'a v1 template',
      message: () => ({ template: credentials!.templateV1Id }),
      // The template's copy lives in the workspace rather than here, so assert that it
      // rendered, not what it says.
      assert: (message) => {
        expect(typeof message.title).toBe('string');
        expect(message.title).not.toBe('');
      },
    },
    {
      name: 'a v2 template',
      message: () => ({ template: credentials!.templateV2Id }),
      assert: (message) => {
        expect(typeof message.title).toBe('string');
        expect(message.title).not.toBe('');
      },
    },
  ];

  const key = (recipient: RecipientCase, content: ContentCase) =>
    `${recipient.name}/${content.name}`;

  function makeClient(userId: string, jwt: string, readTenantId?: string): CourierClient {
    return new CourierClient({
      showLogs: false,
      userId,
      jwt,
      tenantId: readTenantId,
      apiUrls: {
        courier: {
          rest: env('COURIER_REST_URL'),
          graphql: env('COURIER_GRAPHQL_URL'),
        },
        inbox: {
          graphql: env('INBOX_GRAPHQL_URL'),
          webSocket: env('INBOX_WEBSOCKET_URL'),
        },
      },
    });
  }

  beforeAll(async () => {
    await createTenant(credentials!, tenantId);
    await addUserToTenant(credentials!, tenantUserId, tenantId);

    clients.set(
      soloUserId,
      makeClient(soloUserId, await issueUserToken(credentials!, soloUserId))
    );
    clients.set(
      tenantUserId,
      makeClient(tenantUserId, await issueUserToken(credentials!, tenantUserId), tenantId)
    );

    // Register a slot per cell before anything is sent, so a fast delivery can't arrive
    // before there is somewhere to put it.
    const cells = recipients.flatMap((recipient) =>
      contents.map((content) => ({ recipient, content, tag: correlationTag() }))
    );
    for (const cell of cells) {
      socketMessages.set(cell.tag, deferred<InboxMessage>());
    }

    // Subscribe before sending, for the same reason. `onOpen` re-subscribes on reconnect,
    // so the listeners survive a drop during a slow delivery.
    for (const client of clients.values()) {
      client.inbox.socket.addMessageEventListener((envelope) => {
        if (envelope.event !== InboxMessageEvent.NewMessage || !envelope.data) {
          return;
        }
        const tag = envelope.data.tags?.find((candidate) => socketMessages.has(candidate));
        if (tag) {
          socketMessages.get(tag)!.resolve(envelope.data);
        }
      });
      await client.inbox.socket.connect();
    }

    // Fire every send and start every wait now, without awaiting them. Each test then
    // awaits only its own cell. Delivery latency is mostly wall-clock waiting, and jest
    // runs tests serially, so overlapping the nine waits keeps the suite at roughly the
    // slowest single delivery instead of the sum of all nine.
    for (const { recipient, content, tag } of cells) {
      const client = clients.get(recipient.userId())!;

      const delivery = sendMessage(credentials!, {
        to: recipient.to(),
        ...content.message(tag),
        metadata: { tags: [tag] },
      }).then(async (requestId): Promise<Delivery> => {
        const [socketMessage, message] = await Promise.all([
          withTimeout(
            socketMessages.get(tag)!.promise,
            SOCKET_TIMEOUT_MS,
            `No socket message tagged "${tag}" arrived within ${SOCKET_TIMEOUT_MS}ms.`
          ),
          waitForTaggedInboxMessage(client, tag),
        ]);

        const socketClickTrackingId = clickTrackingId(socketMessage);
        if (!socketClickTrackingId) {
          throw new Error(
            `Socket payload for "${tag}" carried no click tracking id, so the message ` +
              'cannot be clicked on arrival.'
          );
        }

        // Click on arrival, which is what the inbox UI does with a socket-delivered
        // message. The id comes off the socket payload rather than the query response so
        // that this exercises the shape the realtime path actually sends.
        await client.inbox.click({
          messageId: socketMessage.messageId,
          trackingId: socketClickTrackingId,
        });

        return { tag, requestId, message, socketMessage, socketClickTrackingId };
      });

      // A cell can settle long before the test that awaits it runs; without this the
      // failure would surface as an unhandled rejection instead of a test failure.
      delivery.catch(() => undefined);

      deliveries.set(key(recipient, content), delivery);
    }
  }, TEST_TIMEOUT_MS);

  afterAll(async () => {
    // Let every cell finish first: a bailed-out run can leave cells still waiting, and
    // tearing down under them turns one real failure into several confusing ones.
    await Promise.allSettled([...deliveries.values()]);

    for (const client of clients.values()) {
      client.inbox.socket.close();
    }

    // Don't leave this run's provisioning behind — and don't let a cleanup error mask
    // the test failure that matters.
    await Promise.allSettled([
      deleteTenant(credentials!, tenantId),
      deleteProfile(credentials!, soloUserId),
      deleteProfile(credentials!, tenantUserId),
    ]);
  }, TEST_TIMEOUT_MS);

  for (const recipient of recipients) {
    describe(`send to ${recipient.name}`, () => {
      for (const content of contents) {
        const cellKey = key(recipient, content);

        it(
          `delivers ${content.name} to the inbox`,
          async () => {
            const { tag, requestId, message } = await deliveries.get(cellKey)!;

            expect(message.messageId).toBe(recipient.expectedMessageId(requestId));
            expect(message.accountId ?? null).toBe(recipient.expectedAccountId());
            expect(message.tags).toContain(tag);
            content.assert(message, tag);
          },
          TEST_TIMEOUT_MS
        );

        it(
          `pushes ${content.name} over the socket and clicks it`,
          async () => {
            const { message, socketMessage, socketClickTrackingId } =
              await deliveries.get(cellKey)!;

            // Same message on both paths — the socket isn't delivering something else.
            expect(socketMessage.messageId).toBe(message.messageId);
            // The realtime payload must carry the id the click was made with, and it must
            // agree with the one the messages query reports.
            expect(socketClickTrackingId).toBe(message.trackingIds?.clickTrackingId);
            // Reaching here means `inbox.click` resolved during setup.
          },
          TEST_TIMEOUT_MS
        );
      }
    });
  }
});
