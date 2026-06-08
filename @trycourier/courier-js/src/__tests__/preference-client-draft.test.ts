import { PreferenceClient } from '../client/preference-client';
import { Logger } from '../utils/logger';
import * as request from '../utils/request';

jest.mock('../utils/request', () => ({
  graphql: jest.fn(),
}));

const graphqlMock = request.graphql as jest.Mock;

function makeClient(tenantId?: string) {
  return new PreferenceClient({
    userId: 'user-1',
    tenantId,
    accessToken: 'jwt-token',
    logger: new Logger(false),
    apiUrls: {
      courier: { rest: 'https://rest.test', graphql: 'https://gql.test' },
      inbox: { graphql: 'https://inbox.test', webSocket: 'wss://inbox.test' },
    },
  } as any);
}

describe('PreferenceClient.getPreferencePage draft support', () => {
  beforeEach(() => {
    graphqlMock.mockReset();
  });

  it('queries the published preferencePage by default', async () => {
    graphqlMock.mockResolvedValue({ data: { preferencePage: { sections: { nodes: [] } } } });

    await makeClient().getPreferencePage();

    const { query } = graphqlMock.mock.calls[0][0];
    expect(query).toContain('preferencePage');
    expect(query).not.toContain('draftPreferencePage');
  });

  it('queries draftPreferencePage (no account arg) when draft is true', async () => {
    graphqlMock.mockResolvedValue({ data: { draftPreferencePage: { sections: { nodes: [] } } } });

    await makeClient('acct-1').getPreferencePage({ draft: true });

    const { query } = graphqlMock.mock.calls[0][0];
    expect(query).toContain('draftPreferencePage');
    // The draft page field takes no account argument...
    expect(query).not.toContain('draftPreferencePage(');
    // ...but recipient preferences are still scoped to the account.
    expect(query).toContain('recipientPreferences(accountId: "acct-1")');
  });

  it('reads the page from the draftPreferencePage response key', async () => {
    graphqlMock.mockResolvedValue({
      data: {
        draftPreferencePage: { showCourierFooter: false, sections: { nodes: [] } },
        recipientPreferences: { nodes: [] },
      },
    });

    const page = await makeClient().getPreferencePage({ draft: true });

    expect(page).not.toBeNull();
    expect(page?.sections).toEqual([]);
  });

  it('passes the brandId fragment in draft mode', async () => {
    graphqlMock.mockResolvedValue({ data: { draftPreferencePage: { sections: { nodes: [] } } } });

    await makeClient().getPreferencePage({ draft: true, brandId: 'brand-9' });

    const { query } = graphqlMock.mock.calls[0][0];
    expect(query).toContain('brand(brandId: "brand-9")');
  });
});
