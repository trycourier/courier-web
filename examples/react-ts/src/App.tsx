import './App.css'
import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

function App() {

  const courier = useCourier();

  useEffect(() => {

    courier.auth.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT
    });

    // courier.inbox.setPaginationLimit(10);

    // courier.inbox.load();

    // courier.inbox.fetchNextPageOfMessages({
    //   feedType: 'archive'
    // });

  }, []);

  return (
    <div className="App">
      <pre className="courier-debug-info">
        {JSON.stringify({
          userId: courier.auth.userId,
          unreadCount: courier.inbox.unreadCount,
          inboxCount: courier.inbox.inbox?.messages.length,
          archiveCount: courier.inbox.archive?.messages.length,
        }, null, 2)}
      </pre>
      <CourierInbox height={'100%'} />
    </div>
  )
}

export default App;
