import { useEffect } from 'react'
import type { NextPage } from 'next'
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-react-17';
import { getSignInProps } from '../../courier-env';

const CustomListItem = ({ message, index }: CourierInboxListItemFactoryProps) => (
  <pre style={{
    padding: '24px',
    borderBottom: '1px solid #e0e0e0',
    margin: '0'
  }}>
    {JSON.stringify({ message, index }, null, 2)}
  </pre>
);

const PopupCustomListItem: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu
        renderListItem={(props: CourierInboxListItemFactoryProps | null | undefined) => {
          if (!props) return <></>;
          return <CustomListItem {...props} />;
        }}
      />
    </div>
  );

}

export default PopupCustomListItem;

