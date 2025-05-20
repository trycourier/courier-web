import './App.css'
import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'
import type { CourierInboxListItemFactoryProps } from '@trycourier/courier-ui-inbox';

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
        mode={'light'}
        lightTheme={THEME}
        darkTheme={THEME}
        listItemFactory={(props: CourierInboxListItemFactoryProps | undefined | null) => {
          return (
            <div style={{
              padding: '12px',
              borderBottom: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer'
            }} onClick={() => {
              !props?.message.read ? courier.inbox.readMessage(props?.message) : courier.inbox.unreadMessage(props?.message);
            }}>
              <div style={{ fontWeight: props?.message.read ? 'normal' : 'bold' }}>
                {props?.message?.title || 'Untitled Message'}
              </div>
              <div style={{ fontWeight: props?.message.read ? 'normal' : 'bold', fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                {props?.message?.preview || 'No preview'}
              </div>
            </div>
          );
        }}
        onMessageClick={(props: CourierInboxListItemFactoryProps) => {
          !props?.message.read ? courier.inbox.readMessage(props?.message) : courier.inbox.unreadMessage(props?.message);
        }}
        onMessageActionClick={({ message, index, action }) => {
          alert(JSON.stringify({ message, index, action }));
        }}
        onMessageLongPress={({ message, index }) => {
          alert(JSON.stringify({ message, index }));
        }}
      />
    </div>
  )
}

export default App;
