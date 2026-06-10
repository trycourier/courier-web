import fetchMock from 'jest-fetch-mock';
import { CourierClient } from '../client/courier-client';

// Self-contained (no live env): mocks fetch and asserts the GraphQL query that
// getMessages sends, verifying how the inbox `accountId` filter is applied.
describe('InboxClient accountId / tenant filter', () => {
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
    const init = fetchMock.mock.calls[0]?.[1];
    const body = JSON.parse((init as RequestInit).body as string);
    return body.query as string;
  }

  it('includes accountId from the per-request filter', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

    await makeClient().inbox.getMessages({ filter: { accountId: 'sample-tenant' } });

    expect(lastQuery()).toContain('accountId: "sample-tenant"');
  });

  it('lets a per-request accountId override the client-level tenantId', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

    await makeClient('client-tenant').inbox.getMessages({ filter: { accountId: 'request-tenant' } });

    const query = lastQuery();
    expect(query).toContain('accountId: "request-tenant"');
    expect(query).not.toContain('client-tenant');
  });

  it('falls back to the client-level tenantId when the filter has no accountId', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

    await makeClient('client-tenant').inbox.getMessages();

    expect(lastQuery()).toContain('accountId: "client-tenant"');
  });

  it('omits accountId entirely when neither filter nor client specify one', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { messages: { nodes: [] } } }));

    await makeClient().inbox.getMessages();

    // No `accountId: "..."` filter argument — `accountId` is still a selected
    // field on each node, so assert on the argument form (with the colon).
    expect(lastQuery()).not.toContain('accountId:');
  });
});
