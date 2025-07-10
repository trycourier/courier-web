'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox, CourierInboxListItemFactoryProps } from '@trycourier/courier-react';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  return (
    <CourierInbox
      onMessageClick={({ message, index }: CourierInboxListItemFactoryProps) => {
        console.log(message);
      }}
    />
  );

}
