import { getClient } from './utils';

describe('PreferenceClient', () => {
  const courierClient = getClient();

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

  // TODO(C-14105): Create test project with channel delivery customization enabled.
  it.skip('should update user preference topic successfully', async () => {
    const topicId = process.env.TOPIC_ID!;
    const result = await courierClient.preferences.putUserPreferenceTopic({
      topicId,
      status: 'OPTED_IN',
      hasCustomRouting: false,
      customRouting: []
    });
    expect(result).toBeUndefined();
  });


  it('should get notification center url successfully', () => {
    const url = courierClient.preferences.getNotificationCenterUrl({
      clientKey: process.env.CLIENT_KEY!,
    });
    expect(url).toBeDefined();
  });

});
