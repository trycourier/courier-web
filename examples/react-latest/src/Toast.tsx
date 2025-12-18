import { useEffect } from 'react'
import {
  CourierInboxPopupMenu,
  CourierToast,
  useCourier,
  type CourierToastItemFactoryProps,
} from '@trycourier/courier-react';

// Render a custom component
const CustomToastItem = ({ message, autoDismiss, autoDismissTimeoutMs }: CourierToastItemFactoryProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  }}>
    <div style={{
      flex: 1,
      padding: '16px',
      background: '#f6f6fe',
      border: '1px solid #c6c2ff',
      borderRadius: '8px',
    }}>
      <strong style={{ display: 'block', marginBottom: '4px' }}>
        {message.title}
      </strong>
      <p style={{ margin: 0, fontSize: '14px' }}>
        {message.body}
      </p>
    </div>

    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '100px'
    }}>
      {message.actions?.map((action, index) => (
        <button
          key={index}
          onClick={() => window.open(action.href)}
          style={{
            padding: '8px 12px',
            background: '#f6f6fe',
            border: '1px solid #c6c2ff',
            borderRadius: '8px',
          }}
        >
          {action.content}
        </button>
      ))}
    </div>
  </div>
);

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    // Authenticate with the Courier backend
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  useEffect(() => {
    // Add a toast manually
    setTimeout(() => {
      courier.toast.addMessage({
        messageId: "1",
        title: "📸 New photos from Fred L.",
        body: "Fred shared 4 photos.",
        actions: [
          {
            content: "See more"
          },
          {
            content: "Mark read"
          }
        ]
      });
    }, 1000);
  }, []);

  return (
    <div>
      <CourierInboxPopupMenu />
      <CourierToast
        renderToastItem={(props) => <CustomToastItem {...props} />}/>
    </div>
  );
}
