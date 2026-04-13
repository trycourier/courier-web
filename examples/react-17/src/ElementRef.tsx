import { useEffect, useRef } from 'react'
import { getSignInProps } from './courier-env'
import {
  CourierInbox,
  useCourier,
  type CourierInboxElement,
} from '@trycourier/courier-react-17'

export default function App() {

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

