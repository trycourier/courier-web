import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
      apiUrls: {
        courier: {
          rest: 'string',
          graphql: 'string',
        },
        inbox: {
          graphql: 'string',
          webSocket: 'string',
        },
      }
    });
  }, []);

  return <CourierInbox height='100%' />;

}
