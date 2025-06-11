'use client'

import { useEffect } from 'react';
import { useCourier, CourierInbox } from '@trycourier/courier-react';
import { CourierInboxListItemFactoryProps } from '@trycourier/courier-ui-inbox';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  return <CourierInbox height='100%' renderListItem={(props: CourierInboxListItemFactoryProps) => {
    return <li className='test'>{props?.index}</li>
  }} />;

}
