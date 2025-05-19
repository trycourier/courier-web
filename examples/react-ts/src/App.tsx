import './App.css'
import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

function App() {

  const Courier = useCourier();

  useEffect(() => {

    Courier.hooks.authentication.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT
    });

    // Courier.hooks.inbox.load();

    // Courier.hooks.inbox.fetchNextPageOfMessages({
    //   feedType: 'archive'
    // });

  }, []);

  return (
    <div className="App">
      <pre className="courier-debug-info">
        {JSON.stringify({
          auth: {
            userId: Courier.hooks.authentication.userId
          },
          inbox: {
            unreadCount: Courier.hooks.inbox.unreadCount,
            inbox: {
              count: Courier.hooks.inbox.inbox?.messages.length
            },
            archive: {
              count: Courier.hooks.inbox.archive?.messages.length
            }
          }
        }, null, 2)}
      </pre>
      <CourierInbox height={'100%'} />
    </div>
  )
}

export default App;
