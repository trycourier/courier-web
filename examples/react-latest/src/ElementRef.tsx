import { useEffect, useRef } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'
import { CourierInbox as CourierInboxElement } from '@trycourier/courier-ui-inbox'

export default function App() {

  const courier = useCourier();
  const inboxRef = useRef<CourierInboxElement>(null);

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
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
