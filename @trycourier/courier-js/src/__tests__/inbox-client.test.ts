import { InboxMessageEvent } from '../types/socket/protocol/messages';
import { getClient } from './utils';

describe('InboxClient', () => {
  const courierClient = getClient();

  it('should fetch messages', async () => {
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

  it('should archive read messages', async () => {
    await expect(courierClient.inbox.archiveRead()).resolves.not.toThrow();
  });

  it('should archive unread messages', async () => {
    await expect(courierClient.inbox.unarchive({
      messageId: process.env.MESSAGE_ID!
    })).resolves.not.toThrow();
  });

  it('Connect to inbox socket', async () => {
    const socket = courierClient.inbox.socket;

    socket.addMessageEventListener((envelope) => {
      expect(envelope).toBeDefined();
      expect(envelope.event).toBe(InboxMessageEvent.NewMessage);
    });

    expect(socket.isOpen).toBe(false);

    // Connect to the socket
    await socket.connect();

    // Subscribe to the socket
    await socket.sendSubscribe();

    // Disconnect from the socket
    socket.close();

    // Wait for 1 second to ensure socket is fully disconnected
    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(socket.isOpen).toBe(false);

  });

  it('should see tenant messages with new client', async () => {
    const newClient = getClient(process.env.TENANT_ID!);
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
