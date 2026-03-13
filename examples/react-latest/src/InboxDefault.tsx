import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      apiUrls: {
        courier: {
          rest: import.meta.env.VITE_COURIER_REST_URL,
          graphql: import.meta.env.VITE_COURIER_GRAPHQL_URL,
        },
        inbox: {
          graphql: import.meta.env.VITE_INBOX_GRAPHQL_URL,
          webSocket: import.meta.env.VITE_INBOX_WEBSOCKET_URL,
        },
      }
    });
  }, []);

  return <CourierInbox />;

}
