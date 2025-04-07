import { CourierClient } from '../index';

describe('PreferenceClient', () => {
  let courierClient: CourierClient;

  beforeEach(() => {
    courierClient = new CourierClient({
      userId: process.env.USER_ID!,
      publicApiKey: process.env.PUBLIC_API_KEY!,
      jwt: process.env.JWT!,
      apiUrls: {
        courier: {
          rest: process.env.COURIER_REST_URL!,
          graphql: process.env.COURIER_GRAPHQL_URL!
        },
        inbox: {
          graphql: process.env.INBOX_GRAPHQL_URL!,
          webSocket: process.env.INBOX_WEBSOCKET_URL!
        }
      },
      showLogs: true
    });
  });

  it('should fetch user preferences successfully', async () => {
    const result = await courierClient.preferences.getUserPreferences();
    expect(result.paging.more).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should fetch user preference topic successfully', async () => {
    const topicId = process.env.TOPIC_ID!;
    const topic = await courierClient.preferences.getUserPreferenceTopic({ topicId });
    expect(topic.topicId).toBe(topicId);
    expect(topic.status).toBeDefined();
    expect(topic.hasCustomRouting).toBeDefined();
    expect(Array.isArray(topic.customRouting)).toBe(true);
  });

  it('should update user preference topic successfully', async () => {
    const topicId = process.env.TOPIC_ID!;
    const result = await courierClient.preferences.putUserPreferenceTopic({
      topicId,
      status: 'OPTED_IN',
      hasCustomRouting: false,
      customRouting: []
    });
    expect(result).toBeUndefined();
  });
});
