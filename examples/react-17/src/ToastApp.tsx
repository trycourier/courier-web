import { CourierToast, useCourier } from '@trycourier/courier-react-17';
import type { CourierToast as CourierToastElement } from '@trycourier/courier-ui-inbox';
import { useEffect, useRef } from 'react';

export function ToastApp() {
  const courier = useCourier();
  const el = useRef<CourierToastElement>(null);

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT
    });
  }, []);

  const customToastItemContent = () => {
    return (
      <div style={{ display: 'flex', gap: '12px', justifyItems: 'center', alignItems: 'center' }}>
        <img width="150px" src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGM4MmdvbmEydGs2cjY2cDBramUzNGVobnMwMDVhODM0bDRpdnAxbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEdv8GjqsvDJ8fCw0/giphy.gif'></img>
        <p>You've got mail!</p>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      courier.toast.addMessage({
        messageId: "1",
        title: "Hi I'm a message!",
        body: "👀"
      });
    }, 1000);
  }, []);

  return <CourierToast
    renderToastItemContent={customToastItemContent}
    dismissButton={'disabled'}
    autoDismiss={true}
    ref={el} />
}
