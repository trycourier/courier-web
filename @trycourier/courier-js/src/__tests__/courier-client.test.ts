import { CourierClient } from '../index';
import { CLIENT_ID_KEY, SDK_KEY, SDK_VERSION_KEY } from '../types/courier-user-agent';
import { UUID } from '../utils/uuid';

const nanoidSpy = jest.spyOn(UUID, "nanoid");

const CONNECTION_ID = "mock-connection-id";
const TEST_USER_ID = 'test-user-id';
const TEST_JWT = 'test-jwt';
const TEST_PUBLIC_API_KEY = 'test-public-api-key';
const TEST_TENANT_ID = 'test-tenant-id';
const TEST_API_URLS = {
  courier: {
    rest: 'https://api.example.com',
    graphql: 'https://api.example.com/client/q'
  },
  inbox: {
    graphql: 'https://inbox.example.com/q',
    webSocket: 'wss://realtime.example.com'
  }
};

describe('CourierClient', () => {

  beforeEach(() => {
    nanoidSpy.mockReturnValue(CONNECTION_ID);
  });

  it('should validate client initialization with all options', () => {
    const testClient = new CourierClient({
      userId: TEST_USER_ID,
      jwt: TEST_JWT,
      publicApiKey: TEST_PUBLIC_API_KEY,
      tenantId: TEST_TENANT_ID,
      showLogs: true,
      apiUrls: TEST_API_URLS
    });

    expect(testClient.options.userId).toBe(TEST_USER_ID);
    expect(testClient.options.jwt).toBe(TEST_JWT);
    expect(testClient.options.publicApiKey).toBe(TEST_PUBLIC_API_KEY);
    expect(testClient.options.connectionId).toBe(CONNECTION_ID);
    expect(testClient.options.tenantId).toBe(TEST_TENANT_ID);
    expect(testClient.options.showLogs).toBe(true);
    expect(testClient.options.apiUrls).toEqual(TEST_API_URLS);
    expect(testClient.options.courierUserAgent).toBeDefined();
    expect(testClient.options.courierUserAgent.getUserAgentInfo()).toEqual({
      [SDK_KEY]: "courier-js",
      [SDK_VERSION_KEY]: "test-version",  // from <package_root>/jest.config.ts
      [CLIENT_ID_KEY]: CONNECTION_ID,
    });
  });

  it('should validate client initialization with minimal options', () => {
    const testClient = new CourierClient({
      userId: TEST_USER_ID,
      publicApiKey: TEST_PUBLIC_API_KEY
    });

    expect(testClient.options.userId).toBe(TEST_USER_ID);
    expect(testClient.options.publicApiKey).toBe(TEST_PUBLIC_API_KEY);
    expect(testClient.options.showLogs).toBe(false);
    expect(testClient.options.courierUserAgent).toBeDefined();
  });

});
