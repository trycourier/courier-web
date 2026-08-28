import { useEffect } from 'react';
import {
  CourierInbox,
  useCourier,
  type CourierInboxTheme,
  type CourierInboxListItemFactoryProps,
  type CourierInboxListItemActionFactoryProps,
} from '@trycourier/courier-react';

/**
 * The same live feed rendered three ways. A value set on a theme outranks the one the action
 * carries, so the middle pane — which sets shape and typography but names no colours — still
 * shows the colours the templates asked for, while the right-hand pane replaces them.
 */
const themed: CourierInboxTheme = {
  inbox: {
    list: {
      item: {
        actions: {
          borderRadius: '2px',
          font: { family: 'Poppins', weight: '600' },
          outlined: {
            borderRadius: '999px',
            hoverBackgroundColor: '#F3E8FF',
            activeBackgroundColor: '#E9D5FF',
          },
          link: {
            textDecoration: 'underline dotted',
            font: { family: 'Poppins', color: '#7C3AED', weight: '600' },
          },
        },
      },
    },
  },
};

/**
 * A theme that names the colours outright. Because a value set on the theme outranks the one the
 * action carries, every button is drawn in the theme's palette whatever the template asked for —
 * while the action's `style` still decides which block applies.
 */
const overriding: CourierInboxTheme = {
  inbox: {
    list: {
      item: {
        actions: {
          backgroundColor: '#0F766E',
          hoverBackgroundColor: '#115E59',
          borderRadius: '6px',
          font: { family: 'Poppins', weight: '600', color: '#FFFFFF' },
          outlined: {
            backgroundColor: 'transparent',
            border: '1px solid #0F766E',
            font: { color: '#0F766E' },
          },
          link: {
            textDecoration: 'underline',
            font: { color: '#0F766E', weight: '600' },
          },
        },
      },
    },
  },
};

function Pane({ title, theme }: { title: string; theme?: CourierInboxTheme }) {
  return (
    <div style={{ flex: 1, minWidth: 340, display: 'flex', flexDirection: 'column' }}>
      <h2
        style={{
          font: '600 12px/1 system-ui, sans-serif',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: '#737373',
          padding: '16px 16px 12px',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, borderTop: '1px solid #E5E5E5' }}>
        <CourierInbox
          lightTheme={theme}
          mode="light"
          onMessageClick={({ message, index }: CourierInboxListItemFactoryProps) => {
            alert('Message clicked at index ' + index + ':\n' + JSON.stringify(message, null, 2));
          }}
          onMessageActionClick={({ message, action, index }: CourierInboxListItemActionFactoryProps) => {
            // The click is reported to Courier before this runs, using action.data.trackingId.
            alert(
              'Action clicked at index ' + index + ':\n' +
              'Action: ' + JSON.stringify(action, null, 2) + '\n' +
              'Message: ' + JSON.stringify(message, null, 2)
            );
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', gap: 1, background: '#E5E5E5' }}>
      <Pane title="SDK defaults" />
      <Pane title="Themed actions" theme={themed} />
      <Pane title="Theme overrides the message" theme={overriding} />
    </div>
  );
}
