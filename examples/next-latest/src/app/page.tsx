'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox } from '@trycourier/courier-react';

export default function Home() {

  const courier = useCourier();

  async function getSampleJwt(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(process.env.NEXT_PUBLIC_JWT!);
      }, 2000);
    });
  }

  useEffect(() => {
    async function signInWithJwt() {
      const jwt = await getSampleJwt();
      courier.shared.signIn({
        userId: process.env.NEXT_PUBLIC_USER_ID!,
        jwt,
      });
    }
    signInWithJwt();
  }, []);

  const handleMessageClick = (props: any) => {
    alert(JSON.stringify(props, null, 2));
  };

  return (
    <div>
      <h1>{courier.inbox.unreadCount}</h1>
      <CourierInbox onMessageClick={handleMessageClick} />
    </div>
  );

}
