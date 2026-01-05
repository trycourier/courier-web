'use client'

import { useEffect, useRef } from 'react'
import {
  CourierInbox,
  useCourier,
  type CourierInboxElement,
} from '@trycourier/courier-react'

export default function ElementRef() {

  const courier = useCourier();
  const inboxRef = useRef<CourierInboxElement>(null);

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);
  useEffect(() => {
    if (inboxRef.current) {
      inboxRef.current.removeHeader();
    }
  }, [inboxRef.current]);

  return <CourierInbox ref={inboxRef} />;

}

