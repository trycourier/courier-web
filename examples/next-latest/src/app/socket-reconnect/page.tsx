'use client'

import { useEffect, useState } from 'react';
import { useCourier, CourierInbox, CourierInboxListItemFactoryProps } from '@trycourier/courier-react';

export default function Home() {
  const courier = useCourier();
  const [count, setCount] = useState(0);

  // Make a render bug that will reload the UI several times
  useEffect(() => {
    if (count < 50) {
      // Sign the user into Courier
      courier.shared.signIn({
        userId: process.env.NEXT_PUBLIC_USER_ID!,
        jwt: process.env.NEXT_PUBLIC_JWT!,
      });

      // Increment the count
      setCount(c => c + 1);
    }
  }, [count]);

  return (
    <div>
      <div>Render Count: {count}</div>
      <CourierInbox
        onMessageClick={({ message, index }: CourierInboxListItemFactoryProps) => {
          console.log(message);
        }}
      />
    </div>
  );
}
