'use client'

import { useEffect, useRef, useState } from 'react';
import { useCourier, CourierInboxPopupMenu, CourierInboxPopupMenuElement, CourierInboxFeedType } from '@trycourier/courier-react';
import { getSignInProps } from '../../courier-env';

export default function Home() {

  const courier = useCourier();
  const inboxRef = useRef<CourierInboxPopupMenuElement>(null);
  const [feedType] = useState<CourierInboxFeedType>('inbox');

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  useEffect(() => {
    if (!inboxRef.current) return;
    // inboxRef.current?.onMessageClick(({ message, index }: any) => {
    //   console.log(message);
    // });
    inboxRef.current?.setFeedType('archive');
  }, [inboxRef.current]);

  return (
    <div className='center'>
      <CourierInboxPopupMenu ref={inboxRef} feedType={feedType} />
    </div>
  );

}
