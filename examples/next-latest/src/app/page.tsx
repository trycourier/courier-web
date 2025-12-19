'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox } from '@trycourier/courier-react';
import Link from 'next/link';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  const handleMessageClick = (props: any) => {
    alert(JSON.stringify(props, null, 2));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/examples" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          View All Examples →
        </Link>
      </div>
      <CourierInbox onMessageClick={handleMessageClick} />
    </div>
  );

}
