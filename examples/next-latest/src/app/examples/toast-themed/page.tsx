'use client'

import { useEffect } from 'react';
import { CourierToast, useCourier, type CourierToastTheme } from '@trycourier/courier-react';

const ToastIcon = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="24" height="24" rx="8" fill="#6366F1" />
  <path d="M11 16.5L14.5 20L21 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const themedToast: CourierToastTheme = {
  item: {
    title: {
      color: '#6366f1',
      weight: '600',
      family: 'Poppins',
      size: '15px',
    },
    body: {
      family: 'Poppins',
      size: '14px',
    },
    actions: {
      font: {
        family: 'Poppins',
        size: '13px',
        weight: '500',
      },
    },
    backgroundColor: '#edeefc',
    border: '1px solid #cdd1ff',
    borderRadius: '15px',
    icon: {
      svg: ToastIcon,
    },
  },
};

export default function ToastThemed() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  const showToast = () => {
    courier.toast.addMessage({
      messageId: 'themed-1',
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
          "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <button type="button" onClick={showToast}>
        Show themed toast
      </button>
      <CourierToast lightTheme={themedToast} />
    </div>
  );
}

