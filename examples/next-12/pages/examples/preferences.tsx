import { useEffect } from 'react'
import type { NextPage } from 'next'
import { CourierPreferences, useCourier } from '@trycourier/courier-react-17'

const PreferencesDefault: NextPage = () => {

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

export default PreferencesDefault;
