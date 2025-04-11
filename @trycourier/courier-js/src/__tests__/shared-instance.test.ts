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

});
