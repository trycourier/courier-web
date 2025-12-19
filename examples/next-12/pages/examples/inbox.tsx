import { useEffect } from 'react'
import type { NextPage } from 'next'
import { CourierInbox, useCourier } from '@trycourier/courier-react-17'

const InboxDefault: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  return <CourierInbox />;

}

export default InboxDefault;

