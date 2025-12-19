import { useEffect } from 'react'
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxMenuButtonFactoryProps,
} from '@trycourier/courier-react';

const CustomMenuButton = ({ totalUnreadCount, feeds }: CourierInboxMenuButtonFactoryProps) => (
  <button>
    Open the Inbox Popup. Total unread count: {totalUnreadCount}
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
        renderMenuButton={(props: CourierInboxMenuButtonFactoryProps | null | undefined) => {
          return <CustomMenuButton totalUnreadCount={props?.totalUnreadCount || 0} feeds={props?.feeds || []} />
        }}
      />
    </div>
  );

}
