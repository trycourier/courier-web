'use client'

import { useEffect } from 'react';
import { useCourier, CourierInboxPopupMenu } from '@trycourier/courier-react';
import { getSignInProps } from '../../courier-env';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
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
