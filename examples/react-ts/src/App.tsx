import './App.css'
import { useEffect, useState } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'
import type { CourierInboxFeedType, CourierInboxHeaderFactoryProps, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from '@trycourier/courier-ui-inbox';
import type { CourierComponentThemeMode } from '@trycourier/courier-ui-core';

function App() {

  const courier = useCourier();
  const [feedType, setFeedType] = useState<CourierInboxFeedType>('inbox');
  const [mode, setMode] = useState<CourierComponentThemeMode>('light');

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
        mode={mode}
        lightTheme={THEME}
        darkTheme={THEME}
        feedType={feedType}
        renderHeader={(props: CourierInboxHeaderFactoryProps | undefined | null) => {
          return (
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontSize: '1.2em', fontWeight: '600' }}>This is the {props?.feedType === 'inbox' ? 'Inbox' : 'Archive'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setFeedType(feedType === 'inbox' ? 'archive' : 'inbox')}
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.9em',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {props?.feedType}
                  <span style={{ fontSize: '0.8em' }}>↔</span>
                </button>
                {props?.unreadCount && props?.unreadCount > 0 && (
                  <span style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.9em'
                  }}>
                    {props?.unreadCount} unread
                  </span>
                )}
              </div>
            </div>
          );
        }}
        renderListItem={(props: CourierInboxListItemFactoryProps | undefined | null) => {
          return (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: props?.message.read ? '#ffffff' : '#f8f9ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }} onClick={() => {
              !props?.message.read ? courier.inbox.readMessage(props?.message) : courier.inbox.unreadMessage(props?.message);
            }}>
              <div style={{
                fontWeight: props?.message.read ? 'normal' : '600',
                fontSize: '1.1em',
                color: props?.message.read ? '#333' : '#000',
                marginBottom: '8px'
              }}>
                {props?.message?.title || 'Untitled Message'}
              </div>
              <div style={{
                fontSize: '0.9em',
                color: '#666',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {props?.message?.preview || 'No preview'}
              </div>
            </div>
          );
        }}
        renderEmptyState={(props: CourierInboxStateEmptyFactoryProps | undefined | null) => {
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 24px',
              color: '#666',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '16px' }}>📭</div>
              <div style={{ fontSize: '1.2em', fontWeight: '500', marginBottom: '8px' }}>No Messages</div>
              <div style={{ fontSize: '0.9em', color: '#888' }}>Your inbox is empty</div>
            </div>
          );
        }}
        renderLoadingState={(props: CourierInboxStateLoadingFactoryProps | undefined | null) => {
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 24px',
              color: '#666'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }} />
              <div style={{ fontSize: '1.1em' }}>Loading messages...</div>
            </div>
          );
        }}
        renderErrorState={(props: CourierInboxStateErrorFactoryProps | undefined | null) => {
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 24px',
              color: '#666',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '16px' }}>⚠️</div>
              <div style={{ fontSize: '1.2em', fontWeight: '500', marginBottom: '8px', color: '#e74c3c' }}>Error</div>
              <div style={{ fontSize: '0.9em', color: '#888' }}>Failed to load messages</div>
            </div>
          );
        }}
        renderPaginationItem={(props: CourierInboxPaginationItemFactoryProps | undefined | null) => {
          return (
            <div style={{
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #eee'
            }}>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em',
                transition: 'background-color 0.2s ease'
              }}>
                Load More
              </button>
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
