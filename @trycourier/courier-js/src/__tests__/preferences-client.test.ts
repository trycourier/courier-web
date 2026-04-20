import { env, getClient } from './utils';

describe('PreferenceClient', () => {
  const courierClient = getClient();

  it('should fetch user preferences successfully', async () => {
    const result = await courierClient.preferences.getUserPreferences();
    expect(result.paging.more).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should fetch user preference topic successfully', async () => {
    const topicId = env('TOPIC_ID');
    const topic = await courierClient.preferences.getUserPreferenceTopic({ topicId });
    expect(topic.topicId).toBe(topicId);
    expect(topic.status).toBeDefined();
    expect(topic.hasCustomRouting).toBeDefined();
    expect(Array.isArray(topic.customRouting)).toBe(true);
  });

  it('should update user preference topic successfully', async () => {
    const topicId = env('TOPIC_ID');
    const result = await courierClient.preferences.putUserPreferenceTopic({
      topicId,
      status: 'OPTED_IN',
      hasCustomRouting: false,
      customRouting: []
    });
    expect(result.topicId).toBe(topicId);
    expect(result.status).toBeDefined();
    expect(result.hasCustomRouting).toBeDefined();
    expect(Array.isArray(result.customRouting)).toBe(true);
  });

  it('should include digestSchedule in fetched topic', async () => {
    const topicId = env('TOPIC_ID');
    const topic = await courierClient.preferences.getUserPreferenceTopic({ topicId });
    expect(topic).toHaveProperty('digestSchedule');
  });

  it('should update digest schedule for a topic', async () => {
    const topicId = env('TOPIC_ID');
    const digestScheduleId = env('DIGEST_SCHEDULE_ID');
    const result = await courierClient.preferences.putUserPreferenceTopic({
      topicId,
      status: 'OPTED_IN',
      hasCustomRouting: false,
      customRouting: [],
      digestSchedule: digestScheduleId,
    });
    expect(result.topicId).toBe(topicId);
    expect(result.digestSchedule).toBe(digestScheduleId);
  });

  it('should ignore an invalid digest schedule id', async () => {
    const topicId = env('TOPIC_ID');
    const invalidId = 'invalid-digest-id-12345';

    const result = await courierClient.preferences.putUserPreferenceTopic({
      topicId,
      status: 'OPTED_IN',
      hasCustomRouting: false,
      customRouting: [],
      digestSchedule: invalidId,
    });
    expect(result.topicId).toBe(topicId);
    expect(result.digestSchedule).not.toBe(invalidId);
  });

  it('should fetch digest schedules for a topic', async () => {
    const topicId = env('TOPIC_ID');
    const schedules = await courierClient.preferences.getDigestSchedules({ topicId });
    expect(Array.isArray(schedules)).toBe(true);
    for (const schedule of schedules) {
      expect(schedule.scheduleId).toBeDefined();
    }
  });

  it('should get notification center url successfully', () => {
    const url = courierClient.preferences.getNotificationCenterUrl({
      clientKey: env('CLIENT_KEY'),
    });
    expect(url).toBeDefined();
  });
});
