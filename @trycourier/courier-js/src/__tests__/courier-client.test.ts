import { CourierClient } from '../index';

describe('CourierClient', () => {

  it('should validate client initialization with all options', () => {
    const testClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!,
      clientKey: process.env.CLIENT_KEY,
      connectionId: 'test-connection',
      tenantId: process.env.TENANT_ID,
      showLogs: true,
      apiUrls: {
        courier: {
          rest: 'https://test-api.courier.com',
          graphql: 'https://test-api.courier.com/graphql'
        },
        inbox: {
          graphql: 'https://test-inbox.courier.com/graphql',
          webSocket: 'wss://test-realtime.courier.com'
        }
      }
    });

    expect(testClient.options.userId).toBe(process.env.USER_ID);
    expect(testClient.options.jwt).toBe(process.env.JWT);
    expect(testClient.options.clientKey).toBe(process.env.CLIENT_KEY);
    expect(testClient.options.connectionId).toBe('test-connection');
    expect(testClient.options.tenantId).toBe(process.env.TENANT_ID);
    expect(testClient.options.showLogs).toBe(true);
    expect(testClient.options.apiUrls).toEqual({
      courier: {
        rest: 'https://test-api.courier.com',
        graphql: 'https://test-api.courier.com/graphql'
      },
      inbox: {
        graphql: 'https://test-inbox.courier.com/graphql',
        webSocket: 'wss://test-realtime.courier.com'
      }
    });
  });

  it('should validate client initialization with minimal options', () => {
    const testClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!
    });

    expect(testClient.options.userId).toBe(process.env.USER_ID);
    expect(testClient.options.jwt).toBe(process.env.JWT);
    expect(testClient.options.showLogs).toBe(false);
    expect(testClient.options.apiUrls).toEqual({
      courier: {
        rest: 'https://api.courier.com',
        graphql: 'https://api.courier.com/client/q'
      },
      inbox: {
        graphql: 'https://inbox.courier.com/q',
        webSocket: 'wss://realtime.courier.com'
      }
    });
  });

});