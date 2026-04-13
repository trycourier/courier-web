import { useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import {
  CourierInbox,
  useCourier,
  type CourierInboxElement,
} from '@trycourier/courier-react-17'
import { getSignInProps } from '../../courier-env'

const ElementRef: NextPage = () => {

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

export default ElementRef;

