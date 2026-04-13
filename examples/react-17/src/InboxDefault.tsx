import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react-17'
import { getSignInProps } from './courier-env'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
  }, []);

  return <CourierInbox />;

}

