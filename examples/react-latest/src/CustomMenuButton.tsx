import { useEffect } from 'react'
import { CourierInboxPopupMenu, useCourier, type CourierInboxMenuButtonFactoryProps } from '@trycourier/courier-react'

const CustomMenuButton = ({ unreadCount }: CourierInboxMenuButtonFactoryProps) => (
  <button>
    Open the Inbox Popup. Unread message count: {unreadCount}
  </button>
);

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu
        renderMenuButton={({ unreadCount }: CourierInboxMenuButtonFactoryProps) => {
          return <CustomMenuButton unreadCount={unreadCount} />
        }}
      />
    </div>
  );

}
