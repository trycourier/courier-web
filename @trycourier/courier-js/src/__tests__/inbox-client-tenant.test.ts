import fetchMock from 'jest-fetch-mock';
import { CourierClient } from '../client/courier-client';

// Self-contained (no live env): mocks fetch and asserts the GraphQL queries the inbox
// client sends. Verifies that the client-level `tenantId` is the single source of tenant
// scope and is applied (as the inbox `accountId` filter) to every read/count request.
describe('InboxClient tenant scoping', () => {
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

  describe('getMessages', () => {
    it('scopes the query to the client-level tenantId', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

      await makeClient('client-tenant').inbox.getMessages();

      expect(lastQuery()).toContain('accountId: "client-tenant"');
    });

    it('keeps scoping to the client tenantId alongside other per-request filters', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

      await makeClient('client-tenant').inbox.getMessages({
        filter: { status: 'unread', tags: ['promo'] },
      });

      const query = lastQuery();
      expect(query).toContain('accountId: "client-tenant"');
      expect(query).toContain('status: "unread"');
      expect(query).toContain('tags: ["promo"]');
    });

    it('omits the accountId filter when the client has no tenantId', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

      await makeClient().inbox.getMessages();

      // `accountId` is still selected on the returned nodes; assert only that it is not
      // used as a filter argument (`accountId: "..."`) in the query params.
      expect(lastQuery()).not.toMatch(/accountId:\s*"/);
    });
  });

  describe('getUnreadMessageCount', () => {
    it('scopes the count to the client-level tenantId', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: { count: 0 } }));

      await makeClient('client-tenant').inbox.getUnreadMessageCount();

      expect(lastQuery()).toContain('accountId: "client-tenant"');
    });

    it('omits the accountId filter when the client has no tenantId', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: { count: 0 } }));

      await makeClient().inbox.getUnreadMessageCount();

      expect(lastQuery()).not.toMatch(/accountId:\s*"/);
    });
  });

  describe('getUnreadCounts', () => {
    it('scopes every dataset count to the client-level tenantId', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));

      await makeClient('client-tenant').inbox.getUnreadCounts({
        inbox: { tags: ['promo'] },
      });

      expect(lastQuery()).toContain('accountId: "client-tenant"');
    });
  });
});
