import { useEffect } from 'react';
import type { NextPage } from 'next'
import { useCourier, CourierInbox } from '@trycourier/courier-react-17';
import Link from 'next/link';

const Home: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/examples" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          View All Examples →
        </Link>
      </div>
      <CourierInbox height='100%' />
    </div>
  );
}

export default Home
