'use client'

import { useEffect } from 'react'
import { CourierPreferences, useCourier } from '@trycourier/courier-react'

export default function PreferencesDefault() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  return (
    <div
      style={{
        margin: 0,
        minHeight: '100vh',
        background: '#F5F5F5',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <CourierPreferences />
      </div>
    </div>
  );

}
