'use client'

import { useEffect, useState } from 'react';
import { useCourier, CourierInbox, CourierInboxListItemFactoryProps } from '@trycourier/courier-react';

export default function Home() {
  const SIGN_IN_COUNT = 3;
  const SIGN_IN_DELAY_MS = 0;

  const courier = useCourier();
  const [signInCount, setSignInCount] = useState(0);

  // This is an intentional bug to reproduce an error condition - we call signIn several times for the same user.
  // This causes:
  //   1. The Inbox socket connection to be closed and reopened.
  //   2. Inbox messages to be refreshed from the server.
  //   3. The UI to reload several times.
  useEffect(() => {
    if (signInCount < SIGN_IN_COUNT) {
      courier.shared.signIn({
        userId: process.env.NEXT_PUBLIC_USER_ID!,
        jwt: process.env.NEXT_PUBLIC_JWT!,
      });

      setTimeout(() => {
        setSignInCount(c => c + 1);
      }, SIGN_IN_DELAY_MS);
    }
  }, [signInCount]);

  return (
    <div>
      <div>Sign In Count: {signInCount}</div>
      <CourierInbox
        onMessageClick={({ message, index }: CourierInboxListItemFactoryProps) => {
          console.log(message);
        }}
      />
    </div>
  );
}
