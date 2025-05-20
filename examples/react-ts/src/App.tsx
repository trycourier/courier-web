import './App.css'
import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

function App() {

  const courier = useCourier();

  useEffect(() => {

    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT
    });

    // courier.auth.signIn({
    //   userId: import.meta.env.VITE_USER_ID,
    //   jwt: import.meta.env.VITE_JWT
    // });

    // courier.inbox.setPaginationLimit(10);

    // courier.inbox.load();

    // courier.inbox.fetchNextPageOfMessages({
    //   feedType: 'archive'
    // });

  }, []);

  const THEME = {
    inbox: {
      header: {
        filters: {
          unreadIndicator: {
            backgroundColor: 'red',
          }
        }
      },
      list: {
        item: {
          unreadIndicatorColor: 'red',
        }
      }
    }
  };

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
      <CourierInbox
        height={'100%'}
        mode={'dark'}
        lightTheme={THEME}
        darkTheme={THEME}
        onMessageClick={({ message, index }) => {
          !message.read ? courier.inbox.readMessage(message) : courier.inbox.unreadMessage(message);
        }}
        onMessageActionClick={({ message, index, action }) => {
          alert(JSON.stringify({ message, index, action }));
          // courier.inbox.markAsUnread(message);
        }}
        onMessageLongPress={({ message, index }) => {
          alert(JSON.stringify({ message, index }));
        }}
      />
    </div>
  )
}

export default App;
