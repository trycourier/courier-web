import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });
  }, []);

  return <CourierInbox height='100%' />;

}
