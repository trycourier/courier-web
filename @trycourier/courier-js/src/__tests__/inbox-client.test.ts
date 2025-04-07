import { CourierClient } from '../client/courier-client';

describe('InboxClient', () => {
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

  it('should fetch paginated messages', async () => {
    const result = await courierClient.inbox.getMessages({
      paginationLimit: 10,
    });
    expect(result.data?.messages?.nodes).toBeDefined();
    expect(result.data?.messages?.pageInfo).toBeDefined();
  });

  it('should fetch archived messages', async () => {
    const result = await courierClient.inbox.getArchivedMessages({
      paginationLimit: 10,
    });
    expect(result.data?.messages?.nodes).toBeDefined();
    expect(result.data?.messages?.pageInfo).toBeDefined();
  });

  it('should return unread message count', async () => {
    const result = await courierClient.inbox.getUnreadMessageCount();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('should track click events', async () => {
    await expect(courierClient.inbox.click({
      messageId: process.env.MESSAGE_ID!,
      trackingId: process.env.MESSAGE_TRACKING_ID!
    })).resolves.not.toThrow();
  });

  it('should mark message as read', async () => {
    await expect(courierClient.inbox.read({
      messageId: process.env.MESSAGE_ID!
    })).resolves.not.toThrow();
  });

  it('should mark message as unread', async () => {
    await expect(courierClient.inbox.unread({
      messageId: process.env.MESSAGE_ID!
    })).resolves.not.toThrow();
  });

  it('should mark all messages as read', async () => {
    await expect(courierClient.inbox.readAll()).resolves.not.toThrow();
  });

  it('should mark message as opened', async () => {
    await expect(courierClient.inbox.open({
      messageId: process.env.MESSAGE_ID!
    })).resolves.not.toThrow();
  });

  it('should archive message', async () => {
    await expect(courierClient.inbox.archive({
      messageId: process.env.MESSAGE_ID!
    })).resolves.not.toThrow();
  });
});
