'use client'

import { useEffect, useRef } from 'react';
import { CourierToast, useCourier } from '@trycourier/courier-react';

const AUTO_DISMISS_TIMEOUT_MS = 6000;
const STACK_STAGGER_MS = 400;

export default function ToastAutoDismiss() {
  const courier = useCourier();

  // Toasts are matched to messages by id, so each one needs a distinct id.
  const count = useRef(0);

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
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
    // Space the burst out so the stack visibly builds instead of landing all at once.
    showToast();
    setTimeout(showToast, STACK_STAGGER_MS);
    setTimeout(showToast, STACK_STAGGER_MS * 2);
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
        down by the timer bar across the top of the toast. Only the toast on top of the
        stack counts down — the ones behind it freeze until they surface, so a burst of
        toasts drains one at a time instead of expiring together. Hover the stack to freeze
        every countdown; they resume from where they left off once the cursor leaves.
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
