import { getClient, hasClientTestEnv, hasTestEnv } from './utils';

const describeIntegration = hasClientTestEnv() ? describe : describe.skip;
const itWithTopicEnv = hasTestEnv('TOPIC_ID') ? it : it.skip;
const itWithClientKeyEnv = hasTestEnv('CLIENT_KEY') ? it : it.skip;

describeIntegration('PreferenceClient', () => {
  const courierClient = getClient();

  it('should fetch user preferences successfully', async () => {
    const result = await courierClient.preferences.getUserPreferences();
    expect(result.paging.more).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });

  itWithTopicEnv('should fetch user preference topic successfully', async () => {
    const topicId = process.env.TOPIC_ID!;
    const topic = await courierClient.preferences.getUserPreferenceTopic({ topicId });
    expect(topic.topicId).toBe(topicId);
    expect(topic.status).toBeDefined();
    expect(topic.hasCustomRouting).toBeDefined();
    expect(Array.isArray(topic.customRouting)).toBe(true);
  });

  itWithTopicEnv('should update user preference topic successfully', async () => {
    const topicId = process.env.TOPIC_ID!;
    const result = await courierClient.preferences.putUserPreferenceTopic({
      topicId,
      status: 'OPTED_IN',
      hasCustomRouting: false,
      customRouting: []
    });
    expect(result.topicId).toBe(topicId);
    expect(result.status).toBe('OPTED_IN');
    expect(result.hasCustomRouting).toBe(false);
  });

  itWithClientKeyEnv('should get notification center url successfully', () => {
    const url = courierClient.preferences.getNotificationCenterUrl({
      clientKey: process.env.CLIENT_KEY!,
    });
    expect(url).toBeDefined();
  });

});
