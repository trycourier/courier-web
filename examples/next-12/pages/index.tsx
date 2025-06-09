import { useEffect } from 'react';
import type { NextPage } from 'next'
import { useCourier, CourierInbox } from '@trycourier/courier-react';

const Home: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  return <CourierInbox height='100%' />;
}

export default Home
