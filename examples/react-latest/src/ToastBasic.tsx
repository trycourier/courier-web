import { useEffect } from 'react';
import { CourierToast, useCourier } from '@trycourier/courier-react';
import { getSignInProps } from './courier-env';

export default function ToastBasic() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
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


