import { useEffect, useState } from 'react'
import { CourierInbox, CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react'
import type { CourierInboxFeedType, CourierInboxHeaderFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxTheme } from '@trycourier/courier-ui-inbox';
import type { CourierComponentThemeMode } from '@trycourier/courier-ui-core';

function App() {
  const courier = useCourier();
  const [feedType, setFeedType] = useState<CourierInboxFeedType>('inbox');
  const [mode] = useState<CourierComponentThemeMode>('light');

  useEffect(() => {
    console.log('User ID', import.meta.env.VITE_USER_ID);
    console.log('JWT', import.meta.env.VITE_JWT);
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });
  }, []);

  const theme: CourierInboxTheme = {
    popup: {
      button: {
        unreadDotIndicator: {
          backgroundColor: '#9b4dca',
        }
      },
      window: {
        backgroundColor: '#fff',
        borderRadius: 'none',
        border: '1px solid #e0e0e0',
        shadow: '0 8px 12px rgba(0,0,0,0.05)'
      }
    },
    inbox: {
      header: {
        filters: {
          unreadIndicator: {
            backgroundColor: '#9b4dca',
          }
        }
      },
      list: {
        item: {
          unreadIndicatorColor: '#9b4dca',
        }
      }
    }
  };

  const renderHeader = (props: CourierInboxHeaderFactoryProps | undefined | null) => {
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
  };

  const renderListItem = (props: CourierInboxListItemFactoryProps | undefined | null) => {
    return (
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
        textAlign: 'left',
        backgroundColor: props?.message.read ? '#ffffff' : '#f8f9ff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }} onClick={() => {
        if (props?.message) {
          !props?.message.read ? courier.inbox.readMessage(props?.message) : courier.inbox.unreadMessage(props?.message);
        }
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
  };

  const renderEmptyState = (_props: CourierInboxStateEmptyFactoryProps | undefined | null) => {
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
  };

  const renderLoadingState = (_props: CourierInboxStateLoadingFactoryProps | undefined | null) => {
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
  };

  const renderErrorState = (_props: CourierInboxStateErrorFactoryProps | undefined | null) => {
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
  };

  const renderPaginationItem = (_props: CourierInboxPaginationItemFactoryProps | undefined | null) => {
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
  };

  const renderMenuButton = (props: CourierInboxMenuButtonFactoryProps | undefined | null) => {
    return (
      <div style={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '4px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
            fill="#666"
          />
        </svg>
        {props && props?.unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {props.unreadCount}
          </div>
        )}
      </div>
    );
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

      <div style={{ padding: '32px' }}>
        <CourierInboxPopupMenu
          popupAlignment={'top-center'}
          popupWidth={'500px'}
          popupHeight={'620px'}
          left={'56px'}
          top={'56px'}
          right={'56px'}
          bottom={'56px'}
          mode={mode}
          lightTheme={theme}
          darkTheme={theme}
          feedType={feedType}
          renderHeader={renderHeader}
          renderListItem={renderListItem}
          renderEmptyState={renderEmptyState}
          renderLoadingState={renderLoadingState}
          renderErrorState={renderErrorState}
          renderPaginationItem={renderPaginationItem}
          renderMenuButton={renderMenuButton}
          onMessageClick={({ message, index: _index }) => {
            !message.read ? courier.inbox.readMessage(message) : courier.inbox.unreadMessage(message);
          }}
          onMessageActionClick={({ message, index, action }) => {
            alert(JSON.stringify({ message, index, action }));
          }}
          onMessageLongPress={({ message, index }) => {
            alert(JSON.stringify({ message, index }));
          }}
        />
      </div>

      <CourierInbox
        height={'100%'}
        mode={mode}
        lightTheme={theme}
        darkTheme={theme}
        feedType={feedType}
        renderHeader={renderHeader}
        renderListItem={renderListItem}
        renderEmptyState={renderEmptyState}
        renderLoadingState={renderLoadingState}
        renderErrorState={renderErrorState}
        renderPaginationItem={renderPaginationItem}
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
