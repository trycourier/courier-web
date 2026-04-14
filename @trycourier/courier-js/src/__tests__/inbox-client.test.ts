import { CourierGetInboxMessagesQueryFilter } from '../types/inbox';
import { InboxMessageEvent } from '../types/socket/protocol/messages';
import { env, getClient } from './utils';

describe('InboxClient', () => {
  const courierClient = getClient();

  describe('getMessages', () => {
    it('should fetch messages and unread count', async () => {
      const result = await courierClient.inbox.getMessages({
        paginationLimit: 10,
      });
      expect(result.data?.messages?.nodes).toBeDefined();
      expect(result.data?.messages?.pageInfo).toBeDefined();
      expect(result.data?.unreadCount).toBeDefined();
    });

    it('should fetch messages with filters', async () => {
      const result = await courierClient.inbox.getMessages({
        filter: {
          status: 'unread',
          tags: ['my-tag'],
        }
      });

      expect(result.data?.messages?.nodes).toBeDefined();
      expect(result.data?.messages?.pageInfo).toBeDefined();
      expect(result.data?.unreadCount).toBeDefined();
    });

    it('should fetch messages with from filter', async () => {
      const from = new Date(Date.now() - 60_000).toISOString();
      const result = await courierClient.inbox.getMessages({
        filter: {
          status: 'unread',
          from,
        }
      });

      expect(result.data?.messages?.nodes).toBeDefined();
      expect(result.data?.count).toBeDefined();
      expect(result.data?.unreadCount).toBeDefined();
    });
  });

  it('should fetch archived messages', async () => {
    const result = await courierClient.inbox.getArchivedMessages({
      paginationLimit: 10,
    });
    expect(result.data?.messages?.nodes).toBeDefined();
    expect(result.data?.messages?.pageInfo).toBeDefined();
    expect(result.data?.unreadCount).toBeDefined();
  });

  it('should return unread message count', async () => {
    const result = await courierClient.inbox.getUnreadMessageCount();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('should get unread counts for multiple filters', async () => {
    const filtersMap: Record<string, CourierGetInboxMessagesQueryFilter> = {
      'all-messages': {},
      'unread-messages': { status: 'unread' },
      'read-messages': { status: 'read' },
      'tagged-messages': { tags: ['my-tag'] },
      'unread-tagged': { status: 'unread', tags: ['my-tag'] }
    };

    const result = await courierClient.inbox.getUnreadCounts(filtersMap);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');

    for (const datasetId of Object.keys(filtersMap)) {
      expect(result).toHaveProperty(datasetId);
      expect(typeof result[datasetId]).toBe('number');
      expect(result[datasetId]).toBeGreaterThanOrEqual(0);
    }
  });

  it('should track click events', async () => {
    await expect(courierClient.inbox.click({
      messageId: env('MESSAGE_ID'),
      trackingId: env('MESSAGE_TRACKING_ID'),
    })).resolves.not.toThrow();
  });

  it('should mark message as read', async () => {
    await expect(courierClient.inbox.read({
      messageId: env('MESSAGE_ID'),
    })).resolves.not.toThrow();
  });

  it('should mark message as unread', async () => {
    await expect(courierClient.inbox.unread({
      messageId: env('MESSAGE_ID'),
    })).resolves.not.toThrow();
  });

  it('should mark all messages as read', async () => {
    await expect(courierClient.inbox.readAll()).resolves.not.toThrow();
  });

  it('should mark message as opened', async () => {
    await expect(courierClient.inbox.open({
      messageId: env('MESSAGE_ID'),
    })).resolves.not.toThrow();
  });

  it('should batch open multiple messages', async () => {
    await expect(courierClient.inbox.batchOpen([
      env('MESSAGE_ID'),
    ])).resolves.not.toThrow();
  });

  it('should archive message', async () => {
    await expect(courierClient.inbox.archive({
      messageId: env('MESSAGE_ID'),
    })).resolves.not.toThrow();
  });

  it('should archive read messages', async () => {
    await expect(courierClient.inbox.archiveRead()).resolves.not.toThrow();
  });

  it('should archive unread messages', async () => {
    await expect(courierClient.inbox.unarchive({
      messageId: env('MESSAGE_ID'),
    })).resolves.not.toThrow();
  });

  it('Connect to inbox socket', async () => {
    const socket = courierClient.inbox.socket;

    socket.addMessageEventListener((envelope) => {
      expect(envelope).toBeDefined();
      expect(envelope.event).toBe(InboxMessageEvent.NewMessage);
    });

    expect(socket.isOpen).toBe(false);

    await socket.connect();
    await socket.sendSubscribe();
    socket.close();

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(socket.isOpen).toBe(false);
  });

  it('should see tenant messages with new client', async () => {
    const newClient = getClient(env('TENANT_ID'));
    const result = await newClient.inbox.getMessages({
      paginationLimit: 10,
    });
    expect(result.data?.messages?.nodes).toBeDefined();
    expect(result.data?.messages?.pageInfo).toBeDefined();
  });

  it('testing socket events', async () => {
    const socket = courierClient.inbox.socket;

    socket.addMessageEventListener((envelope) => {
      expect(envelope).toBeDefined();
      expect(envelope.event).toBe(InboxMessageEvent.NewMessage);
    });

    await socket.connect();
    socket.sendSubscribe();

    await new Promise(resolve => setTimeout(resolve, 1000));

    socket.close();
  }, 6000);
});
