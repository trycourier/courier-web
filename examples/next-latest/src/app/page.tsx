'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox, CourierInboxListItemFactoryProps } from '@trycourier/courier-react';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  return (
    <CourierInbox
      height='100%'
      onMessageClick={(props: CourierInboxListItemFactoryProps) => {
        alert(JSON.stringify(props));
      }}
    />
  );

}
