'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox } from '@trycourier/courier-react';

export default function Home() {

  // Initialize the courier client
  const courier = useCourier();

  useEffect(() => {

    // Log the user ID and JWT
    console.log({
      userId: process.env.NEXT_PUBLIC_USER_ID,
      jwt: process.env.NEXT_PUBLIC_JWT,
    });

    // Sign in the user
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });

  }, []);

  return <CourierInbox height='100%' />;

}
