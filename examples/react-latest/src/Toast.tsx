import { useEffect, useRef, useState } from 'react'
import { CourierToast, useCourier } from '@trycourier/courier-react'
import type { CourierToast as CourierToastElement, CourierToastItemFactoryProps } from '@trycourier/courier-ui-toast';

function CustomElement(props: CourierToastItemFactoryProps) {
  return (
    <div>
      <p>{props.message.title}</p>
    </div>
  )
}

export default function App() {

  const courier = useCourier();
  const el = useRef<CourierToastElement>(null);

  const [toastReady, setToastReady] = useState(false);

  useEffect(() => {
    if (!toastReady) return;

    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, [toastReady]);

  useEffect(() => {
    setTimeout(() => {
      courier.toast.addMessage({
        messageId: "1",
        title: "We've been working on something...",
        body: "👀"
      });
    }, 2000);

    setTimeout(() => {
      courier.toast.addMessage({
        messageId: "2",
        title: "A bit of the same...",
        body: "But a whole lot that's new"
      });
    }, 5000);

    setTimeout(() => {
      courier.toast.addMessage({
        messageId: "3",
        title: "Re-introducing Toasts",
        body: "Dismissible in-app messages, fully customizable and synced with Courier Inbox"
      });
    }, 8000);

  }, []);

  return <CourierToast ref={el} autoDismissTimeoutMs={10000} onReady={setToastReady} />;


}
