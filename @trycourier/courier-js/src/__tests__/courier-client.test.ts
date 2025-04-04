import { CourierClient } from '../index';

describe('CourierClient', () => {

  it('should validate client initialization with all options', () => {
    const testClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!,
      publicApiKey: process.env.PUBLIC_API_KEY!,
      connectionId: 'test-connection',
      tenantId: process.env.TENANT_ID,
      showLogs: true,
      apiUrls: {
        courier: {
          rest: process.env.COURIER_REST_URL!,
          graphql: process.env.COURIER_GRAPHQL_URL!
        },
        inbox: {
          graphql: process.env.INBOX_GRAPHQL_URL!,
          webSocket: process.env.INBOX_WEBSOCKET_URL!
        }
      }
    });

    expect(testClient.options.userId).toBe(process.env.USER_ID);
    expect(testClient.options.jwt).toBe(process.env.JWT);
    expect(testClient.options.publicApiKey).toBe(process.env.PUBLIC_API_KEY);
    expect(testClient.options.connectionId).toBe('test-connection');
    expect(testClient.options.tenantId).toBe(process.env.TENANT_ID);
    expect(testClient.options.showLogs).toBe(true);
    expect(testClient.options.apiUrls).toEqual({
      courier: {
        rest: process.env.COURIER_REST_URL!,
        graphql: process.env.COURIER_GRAPHQL_URL!
      },
      inbox: {
        graphql: process.env.INBOX_GRAPHQL_URL!,
        webSocket: process.env.INBOX_WEBSOCKET_URL!
      }
    });
  });

  it('should validate client initialization with minimal options', () => {
    const testClient = new CourierClient({
      userId: process.env.USER_ID!,
      publicApiKey: process.env.PUBLIC_API_KEY!
    });

    expect(testClient.options.userId).toBe(process.env.USER_ID);
    expect(testClient.options.publicApiKey).toBe(process.env.PUBLIC_API_KEY);
    expect(testClient.options.showLogs).toBe(false);
  });

});