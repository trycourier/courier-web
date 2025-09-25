import { useEffect, useRef } from 'react'
import { CourierToast, useCourier } from '@trycourier/courier-react'
import type { CourierToast as CourierToastElement } from '@trycourier/courier-ui-inbox';

export default function App() {

  const courier = useCourier();
  const el = useRef<CourierToastElement>(null);

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      el.current?.addInboxMessage({
        messageId: "1",
        title: "We've been working on something...",
        body: "👀"
      });
    }, 2000);

    setTimeout(() => {
      el.current?.addInboxMessage({
        messageId: "2",
        title: "A bit of the same...",
        body: "But a whole lot that's new"
      });
    }, 5000);

    setTimeout(() => {
      el.current?.addInboxMessage({
        messageId: "3",
        title: "Re-introducing Toasts",
        body: "Dismissible in-app messages, fully customizable and synced with Courier Inbox"
      });
    }, 8000);

    setTimeout(() => {
      el.current?.dismissToastForMessage({ messageId: "3" });
    }, 10000);

  }, []);

  return <CourierToast ref={el} />;


}
