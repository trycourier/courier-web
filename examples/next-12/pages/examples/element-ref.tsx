import { useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import {
  CourierInbox,
  useCourier,
  type CourierInboxElement,
} from '@trycourier/courier-react-17'

const ElementRef: NextPage = () => {

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

export default ElementRef;

