import { useEffect } from 'react'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react-17'
import { getSignInProps } from './courier-env'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu />
    </div>
  );

}

