import { useEffect } from 'react'
import type { NextPage } from 'next'
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxMenuButtonFactoryProps,
} from '@trycourier/courier-react-17';
import { getSignInProps } from '../../courier-env';

const CustomMenuButton = ({ totalUnreadCount, feeds }: CourierInboxMenuButtonFactoryProps) => (
  <button>
    Open the Inbox Popup. Total unread count: {totalUnreadCount}
  </button>
);

const CustomMenuButtonPage: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
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

export default CustomMenuButtonPage;

