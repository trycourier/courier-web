import { CourierClient } from '../index';
import { CLIENT_ID_KEY, SDK_KEY, SDK_VERSION_KEY } from '../types/courier-user-agent';
import { UUID } from '../utils/uuid';

const nanoidSpy = jest.spyOn(UUID, "nanoid");

const CONNECTION_ID = "mock-connection-id";
const USER_AGENT_CLIENT_NAME = "test-sdk";
const USER_AGENT_CLIENT_VERSION = "test-sdk-version";

describe('CourierClient', () => {

  beforeEach(() => {
    nanoidSpy.mockReturnValue(CONNECTION_ID);
  });

  it('should validate client initialization with all options', () => {
    const testClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!,
      publicApiKey: process.env.PUBLIC_API_KEY!,
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
    expect(testClient.options.connectionId).toBe(CONNECTION_ID);
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
    expect(testClient.options.courierUserAgent).toBeDefined();
    expect(testClient.options.courierUserAgent.getUserAgentInfo()).toEqual({
      [SDK_KEY]: "courier-js",
      [SDK_VERSION_KEY]: "test-version",  // from <package_root>/jest.config.ts
      [CLIENT_ID_KEY]: CONNECTION_ID,
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
    expect(testClient.options.courierUserAgent).toBeDefined();
  });

});
