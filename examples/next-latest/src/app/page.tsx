'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox } from '@trycourier/courier-react';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  // Handler for message click
  const handleMessageClick = (props: any) => {
    alert(JSON.stringify(props, null, 2));
  };

  return (
    <CourierInbox onMessageClick={handleMessageClick} />
  );

}
