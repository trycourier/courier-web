import { useEffect } from 'react'
import type { NextPage } from 'next'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react-17'
import { getSignInProps } from '../../courier-env'

const InboxPopupMenuDefault: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu />
    </div>
  );

}

export default InboxPopupMenuDefault;

