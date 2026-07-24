import { useEffect, useRef } from 'react';
import { CourierToast, useCourier } from '@trycourier/courier-react';

const AUTO_DISMISS_TIMEOUT_MS = 6000;

export default function ToastAutoDismiss() {
  const courier = useCourier();

  // Toasts are matched to messages by id, so each one needs a distinct id.
  const count = useRef(0);

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  const showToast = () => {
    count.current += 1;
    courier.toast.addMessage({
      messageId: `auto-dismiss-${count.current}`,
      title: `📸 New photos from Fred L. (${count.current})`,
      body: 'Fred shared 4 photos.',
      actions: [
        { content: 'See more' },
        { content: 'Mark read' },
      ],
    });
  };

  const showToastStack = () => {
    showToast();
    showToast();
    showToast();
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
      <h1 style={{ margin: '0 0 6px', fontSize: 22 }}>
        Toast — Auto-dismiss timer
      </h1>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#555555', maxWidth: 560 }}>
        Each toast dismisses itself after {AUTO_DISMISS_TIMEOUT_MS / 1000} seconds, counted
        down by the timer bar across the top of the toast. Hover the toast to freeze the
        countdown — every toast in the stack pauses, and they all resume from where they
        left off once the cursor leaves.
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={showToast}>
          Show timed toast
        </button>
        <button type="button" onClick={showToastStack}>
          Show 3 timed toasts
        </button>
      </div>

      <CourierToast
        autoDismiss
        autoDismissTimeoutMs={AUTO_DISMISS_TIMEOUT_MS}
      />
    </div>
  );
}
