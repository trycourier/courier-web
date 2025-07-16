'use client'

import { useEffect } from 'react';
import { useCourier, CourierInboxPopupMenu } from '@trycourier/courier-react';

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
    <div className='center'>
      <CourierInboxPopupMenu onMessageClick={handleMessageClick} />
    </div>
  );

}
