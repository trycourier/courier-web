import { useEffect } from 'react';
import type { NextPage } from 'next'
import { CourierToast, useCourier } from '@trycourier/courier-react-17';

const ToastBasic: NextPage = () => {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  const showToast = () => {
    courier.toast.addMessage({
      messageId: 'basic-1',
      title: '📸 New photos from Fred L.',
      body: 'Fred shared 4 photos.',
      actions: [
        { content: 'See more' },
        { content: 'Mark read' },
      ],
    });
  };

  return (
    <div
      style={{
        margin: 0,
        minHeight: '100vh',
        padding: 40,
        boxSizing: 'border-box',
        background: 'white',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <button type="button" onClick={showToast}>
        Show basic toast
      </button>
      <CourierToast />
    </div>
  );
}

export default ToastBasic;

