'use client'

import { useEffect, useRef } from 'react'
import {
  CourierInbox,
  useCourier,
  type CourierInboxElement,
} from '@trycourier/courier-react'
import { getSignInProps } from '../../../courier-env'

export default function ElementRef() {

  const courier = useCourier();
  const inboxRef = useRef<CourierInboxElement>(null);

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);
  useEffect(() => {
    if (inboxRef.current) {
      inboxRef.current.removeHeader();
    }
  }, [inboxRef.current]);

  return <CourierInbox ref={inboxRef} />;

}

