import { Courier } from '../shared/courier';
import { InboxMessageEvent } from '../types/socket/protocol/messages';

describe('Shared Courier instance', () => {
  it('should notify auth listeners when signing in and out', () => {
    let authState: { userId?: string } | undefined;

    Courier.shared.addAuthenticationListener((props) => {
      authState = props;
    });

    Courier.shared.signIn({ userId: 'test-user' });
    expect(authState).toEqual({ userId: 'test-user' });

    Courier.shared.signOut();
    expect(authState).toEqual({ userId: undefined });
  });

  it('should only call active listeners when message is received', () => {
    const listener1Calls = jest.fn();
    const listener2Calls = jest.fn();

    // Sign in, add a listener, close the connection
    Courier.shared.signIn({ userId: 'test-user-1' });
    const socket1 = Courier.shared.client?.inbox.socket!;
    socket1.addMessageEventListener(listener1Calls);

    // Sign in again (creates new socket client and will call close() on the first client)
    Courier.shared.signIn({ userId: 'test-user-2' });
    const socket2 = Courier.shared.client?.inbox.socket!;
    socket2.addMessageEventListener(listener2Calls);

    // Simulate receiving a message on second socket client
    socket2.onMessageReceived({
      event: InboxMessageEvent.NewMessage,
      data: { messageId: '2', created: '2024-01-02' }
    });

    expect(socket1).not.toBe(socket2);

    // Only the second listener should be called
    expect(listener1Calls).toHaveBeenCalledTimes(0);
    expect(listener2Calls).toHaveBeenCalledTimes(1);
  });
});
