import { useEffect } from 'react'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react'

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
      <CourierInboxPopupMenu
        popupAlignment="top-right"
        popupWidth="340px"
        popupHeight="400px"
        top="44px"
        right="44px"
      />
    </div>
  );

}
