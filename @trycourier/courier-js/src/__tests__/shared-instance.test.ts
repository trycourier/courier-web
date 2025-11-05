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

    // Sign in and add first listener
    Courier.shared.signIn({ userId: 'test-user-1' });
    const socket1 = Courier.shared.client?.inbox.socket!;
    socket1.addMessageEventListener(listener1Calls);

    // Simulate receiving a message on first socket
    socket1.onMessageReceived({
      event: InboxMessageEvent.NewMessage,
      data: { messageId: '1', created: '2024-01-01' }
    });

    expect(listener1Calls).toHaveBeenCalledTimes(1);
    expect(listener2Calls).toHaveBeenCalledTimes(0);

    // Sign in again (creates new socket)
    Courier.shared.signIn({ userId: 'test-user-2' });
    const socket2 = Courier.shared.client?.inbox.socket!;
    socket2.addMessageEventListener(listener2Calls);

    // Simulate receiving a message on second socket
    socket2.onMessageReceived({
      event: InboxMessageEvent.NewMessage,
      data: { messageId: '2', created: '2024-01-02' }
    });

    // Only the second listener should be called
    // listener1 still only called 1 time total
    expect(listener1Calls).toHaveBeenCalledTimes(1);
    expect(listener2Calls).toHaveBeenCalledTimes(1);

    // Old socket's listener should not be called for new messages
    expect(socket1).not.toBe(socket2);
  });

});
