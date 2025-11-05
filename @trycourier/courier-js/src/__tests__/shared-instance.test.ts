import { Courier } from '../shared/courier';

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

  it('should not accumulate duplicate socket listeners when signIn is called twice in quick succession', async () => {
    // Track how many times a listener is added
    let listenerAddCount = 0;

    // Add an auth listener that simulates what CourierInbox does:
    // it adds a socket listener on every signIn
    Courier.shared.addAuthenticationListener(async (props) => {
      if (props.userId) {
        const socket = Courier.shared.client?.inbox.socket;
        if (socket) {
          // Simulate adding a listener like the datastore does
          socket.addMessageEventListener(() => {
            // Empty listener for testing
          });
          listenerAddCount++;
        }
      }
    });

    // First signIn
    Courier.shared.signIn({ userId: 'test-user-1' });
    await new Promise(resolve => setTimeout(resolve, 0)); // Let async operations settle

    const firstSocket = Courier.shared.client?.inbox.socket;
    const firstListenerCount = (firstSocket as any)?.messageEventListeners?.length || 0;

    // Second signIn immediately (simulating race condition)
    Courier.shared.signIn({ userId: 'test-user-2' });
    await new Promise(resolve => setTimeout(resolve, 0)); // Let async operations settle

    const secondSocket = Courier.shared.client?.inbox.socket;
    const secondListenerCount = (secondSocket as any)?.messageEventListeners?.length || 0;

    // The second socket should only have 1 listener, not accumulated listeners
    // from the first socket or duplicate registrations
    expect(firstListenerCount).toBe(1);
    expect(secondListenerCount).toBe(1);

    // We should have added exactly 2 listeners total (one per signIn),
    // but they should be on different socket instances
    expect(listenerAddCount).toBe(2);
  });

});
