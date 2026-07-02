import fetchMock from 'jest-fetch-mock';
import { CourierClient } from '../client/courier-client';
import { CourierUserPreferencesChannel, CourierUserPreferencesStatus } from '../types/preference';

// Self-contained (no live env): mocks fetch and asserts the GraphQL the preferences client
// sends. Verifies tenant scoping — the per-call `accountId` (used by the
// <courier-preferences> `tenant-id` prop) and the fallback to the client-level `tenantId`
// set at signIn — is applied to both reads (getPreferencePage) and writes
// (putUserPreferenceTopic), matching the v7 behavior where tenantId mapped to accountId.
describe('PreferenceClient tenant scoping', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });

  afterEach(() => {
    // Restore the suite-wide default (real fetch) set in jest.setup.ts.
    fetchMock.dontMock();
  });

  function makeClient(tenantId?: string) {
    return new CourierClient({
      userId: 'test-user-id',
      jwt: 'test-jwt',
      showLogs: false,
      tenantId,
    });
  }

  function lastQuery(): string {
    const calls = fetchMock.mock.calls;
    const init = calls[calls.length - 1]?.[1];
    const body = JSON.parse((init as RequestInit).body as string);
    return body.query as string;
  }

  describe('getPreferencePage (reads)', () => {
    it('scopes the page and recipient preferences to a per-call accountId', async () => {
      // Empty data -> method returns null after sending the query, which is all we assert on.
      fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));

      await makeClient().preferences.getPreferencePage({ accountId: 'tenant-123' });

      const query = lastQuery();
      expect(query).toMatch(/preferencePage\(accountId: "tenant-123"\)/);
      expect(query).toMatch(/recipientPreferences\(accountId: "tenant-123"\)/);
    });

    it('falls back to the client-level tenantId when accountId is omitted', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));

      await makeClient('signin-tenant').preferences.getPreferencePage();

      expect(lastQuery()).toContain('accountId: "signin-tenant"');
    });

    it('per-call accountId overrides the client-level tenantId', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));

      await makeClient('signin-tenant').preferences.getPreferencePage({ accountId: 'override' });

      const query = lastQuery();
      expect(query).toContain('accountId: "override"');
      expect(query).not.toContain('signin-tenant');
    });

    it('omits the accountId filter when there is no tenant', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));

      await makeClient().preferences.getPreferencePage();

      expect(lastQuery()).not.toMatch(/accountId:\s*"/);
    });
  });

  describe('putUserPreferenceTopic (writes)', () => {
    const node = JSON.stringify({ data: { updatePreferenceV2: { templateId: 't1' } } });
    const base = {
      topicId: 't1',
      status: 'OPTED_IN' as CourierUserPreferencesStatus,
      hasCustomRouting: false,
      customRouting: [] as CourierUserPreferencesChannel[],
    };

    it('scopes the write to a per-call accountId', async () => {
      fetchMock.mockResponseOnce(node);

      await makeClient().preferences.putUserPreferenceTopic({ ...base, accountId: 'tenant-123' });

      expect(lastQuery()).toContain('accountId: "tenant-123"');
    });

    it('falls back to the client-level tenantId when accountId is omitted', async () => {
      fetchMock.mockResponseOnce(node);

      await makeClient('signin-tenant').preferences.putUserPreferenceTopic({ ...base });

      expect(lastQuery()).toContain('accountId: "signin-tenant"');
    });

    it('omits accountId when there is no tenant', async () => {
      fetchMock.mockResponseOnce(node);

      await makeClient().preferences.putUserPreferenceTopic({ ...base });

      expect(lastQuery()).not.toMatch(/accountId:\s*"/);
    });
  });
});
