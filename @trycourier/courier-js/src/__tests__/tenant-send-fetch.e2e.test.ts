import { CourierClient } from '../client/courier-client';

// Live end-to-end test against the Courier production API, exercising the multi-tenant
// inbox flow with the LOCAL courier-js build.
//
// ⚠️ Uses a hardcoded server API key — DO NOT COMMIT. Run locally only.
//
// FINDING (verified by this test): a templated Send with `context.tenant_id` DOES deliver
// to the inbox (it shows up in an unscoped getMessages), but the inbox stores `accountId: null`
// — the tenant context is NOT propagated to the inbox record. So a tenantId-scoped read
// (the SDK's `tenantId` → inbox `accountId` filter) does NOT return it. The only thing that
// sets the inbox `accountId` is the inbox ingest API. The SDK filter works correctly; the
// gap is in the Send → inbox pipeline (backend/product), not in courier-js.

const API_BASE = 'https://api.courier.com';
const INBOX_GRAPHQL = 'https://inbox.courier.com/q';
const COURIER_API_KEY = 'pk_CRRRYD4XM9MV6MM8VCG66FXJNDH0';
const TEMPLATE_ID = 'nt_01ktc9s2gtf6bv471bjp2af1r4';
const EMAIL = 'mike@courier.com';

const SAMPLE_USER_ID = 'sample-user';
const SAMPLE_TENANT_ID = 'sample-tenant';

function serverHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${COURIER_API_KEY}`, 'Content-Type': 'application/json' };
}

async function createUser(userId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/profiles/${encodeURIComponent(userId)}`, {
    method: 'POST',
    headers: serverHeaders(),
    body: JSON.stringify({ profile: { email: EMAIL } }),
  });
  if (!res.ok) throw new Error(`createUser ${userId}: ${res.status} ${await res.text()}`);
}

async function upsertTenant(tenantId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tenants/${encodeURIComponent(tenantId)}`, {
    method: 'PUT',
    headers: serverHeaders(),
    body: JSON.stringify({ name: `Test Tenant ${tenantId}` }),
  });
  if (!res.ok) throw new Error(`upsertTenant ${tenantId}: ${res.status} ${await res.text()}`);
}

async function addUserToTenant(tenantId: string, userId: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/users/${encodeURIComponent(userId)}/tenants/${encodeURIComponent(tenantId)}`,
    { method: 'PUT', headers: serverHeaders(), body: JSON.stringify({}) },
  );
  if (!res.ok) throw new Error(`addUserToTenant ${tenantId}/${userId}: ${res.status} ${await res.text()}`);
}

async function sendTemplated(userId: string, tenantId: string, note: string): Promise<string> {
  const res = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: serverHeaders(),
    body: JSON.stringify({
      message: {
        to: { user_id: userId },
        context: { tenant_id: tenantId },
        template: TEMPLATE_ID,
        data: { message: note },
      },
    }),
  });
  if (!res.ok) throw new Error(`send: ${res.status} ${await res.text()}`);
  return (await res.json()).requestId as string;
}

async function issueUserToken(userId: string): Promise<string> {
  const scope = [`user_id:${userId}`, 'inbox:read:messages', 'inbox:write:events', 'read:brands'].join(' ');
  const res = await fetch(`${API_BASE}/auth/issue-token`, {
    method: 'POST',
    headers: serverHeaders(),
    body: JSON.stringify({ scope, expires_in: '2 days' }),
  });
  if (!res.ok) throw new Error(`issueToken: ${res.status} ${await res.text()}`);
  return (await res.json()).token as string;
}

/** Read the inbox with the LOCAL web SDK. Pass a tenantId to scope (client-level), or omit for unscoped. */
async function getInbox(userId: string, tenantId?: string) {
  const jwt = await issueUserToken(userId);
  const client = new CourierClient({ userId, tenantId, jwt, showLogs: false });
  const res = await client.inbox.getMessages({ paginationLimit: 50 });
  return res.data?.messages?.nodes ?? [];
}

/** Poll the (optionally scoped) inbox until it has >= target messages, or time out. */
async function waitForCount(userId: string, tenantId: string | undefined, target: number, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  let nodes = await getInbox(userId, tenantId);
  while (nodes.length < target && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));
    nodes = await getInbox(userId, tenantId);
  }
  return nodes;
}

const summarize = (nodes: any[]) => nodes.map((n) => ({ id: n.messageId, accountId: n.accountId, title: n.title }));

describe('multi-tenant inbox send → fetch (live)', () => {
  it('reports how many messages the sample user/tenant currently has', async () => {
    const scoped = await getInbox(SAMPLE_USER_ID, SAMPLE_TENANT_ID);
    // eslint-disable-next-line no-console
    console.log(
      `\n📥 ${SAMPLE_USER_ID} @ ${SAMPLE_TENANT_ID}: ${scoped.length} tenant-scoped message(s)\n` +
        JSON.stringify(summarize(scoped), null, 2),
    );
    // Whatever is returned under the tenant scope must actually carry that accountId.
    for (const n of scoped) expect(n.accountId).toBe(SAMPLE_TENANT_ID);
  }, 60000);

  it('a template send with context.tenant_id reaches the inbox but with accountId=null (x3 fresh tenants)', async () => {
    const stamp = Date.now();

    for (let i = 0; i < 3; i++) {
      const userId = `e2e-user-${stamp}-${i}`;
      const tenantId = `e2e-tenant-${stamp}-${i}`;

      await createUser(userId);
      await upsertTenant(tenantId);
      await addUserToTenant(tenantId, userId);

      // Brand-new scope: both reads start empty.
      expect((await getInbox(userId, tenantId)).length).toBe(0);
      expect((await getInbox(userId)).length).toBe(0);

      const requestId = await sendTemplated(userId, tenantId, `fresh send #${i}`);
      // eslint-disable-next-line no-console
      console.log(`\n[${i}] ➡️  sent to ${userId}@${tenantId} (requestId=${requestId})`);

      // The message DOES arrive in the inbox — visible via an unscoped read.
      const unscoped = await waitForCount(userId, undefined, 1);
      // eslint-disable-next-line no-console
      console.log(`[${i}] 📥 unscoped: ${unscoped.length} — ${JSON.stringify(summarize(unscoped))}`);
      expect(unscoped.length).toBeGreaterThanOrEqual(1);

      // ...but the inbox record's accountId is null — the tenant context did NOT propagate.
      expect(unscoped[0].accountId).toBeNull();

      // ...so the tenant-scoped read (SDK tenantId → accountId filter) still finds nothing.
      const scoped = await getInbox(userId, tenantId);
      // eslint-disable-next-line no-console
      console.log(`[${i}] 🔒 scoped(${tenantId}): ${scoped.length} (expected 0 — backend gap)`);
      expect(scoped.length).toBe(0);
    }
  }, 300000);

  it('control: the inbox ingest API DOES set accountId, so tenant-scoped read returns it', async () => {
    const stamp = Date.now();
    const userId = `e2e-ingest-${stamp}`;
    const tenantId = `e2e-ingest-tenant-${stamp}`;
    await createUser(userId);

    // Ingest a message with an explicit accountId (requires inbox:write:messages scope).
    const scope = [`user_id:${userId}`, 'inbox:read:messages', 'inbox:write:messages', 'inbox:write:events'].join(' ');
    const tokenRes = await fetch(`${API_BASE}/auth/issue-token`, {
      method: 'POST',
      headers: serverHeaders(),
      body: JSON.stringify({ scope, expires_in: '2 days' }),
    });
    if (!tokenRes.ok) {
      // eslint-disable-next-line no-console
      console.log(`(skip) ingest token denied: ${tokenRes.status} ${await tokenRes.text()}`);
      return;
    }
    const jwt = (await tokenRes.json()).token as string;

    const ingestRes = await fetch('https://inbox.courier.com/inbox', {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}`, 'x-courier-user-id': userId, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: tenantId,
        event: 'inbox.new',
        messageId: `ingest-${stamp}`,
        message: { title: 'Ingested tenant message', preview: 'hello', elemental: { version: '2022-01-01', elements: [] } },
      }),
    });
    if (!ingestRes.ok) {
      // eslint-disable-next-line no-console
      console.log(`(skip) ingest write denied: ${ingestRes.status} ${await ingestRes.text()}`);
      return;
    }

    const scoped = await waitForCount(userId, tenantId, 1, 30000);
    // eslint-disable-next-line no-console
    console.log(`\n🧪 ingest → scoped(${tenantId}): ${scoped.length} — ${JSON.stringify(summarize(scoped))}`);
    expect(scoped.length).toBeGreaterThanOrEqual(1);
    expect(scoped[0].accountId).toBe(tenantId);
  }, 120000);
});
