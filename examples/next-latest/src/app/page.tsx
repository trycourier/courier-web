'use client'

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCourier } from '@trycourier/courier-react';

const CourierInbox = dynamic(
  () => import('@trycourier/courier-react').then(mod => mod.CourierInbox),
  { ssr: false }
);

export default function Home() {
  const courier = useCourier();

  useEffect(() => {
    console.log('User ID', process.env.NEXT_PUBLIC_USER_ID);
    console.log('JWT', process.env.NEXT_PUBLIC_JWT);
    // courier.shared.signIn({
    //   userId: process.env.NEXT_PUBLIC_USER_ID!,
    //   jwt: process.env.NEXT_PUBLIC_JWT!,
    //   showLogs: false,
    // });
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CourierInbox />
    </div>
  );
}
