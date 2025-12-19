import { useEffect } from 'react'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react-17'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu />
    </div>
  );

}

