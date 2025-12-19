import { useEffect } from 'react'
import type { NextPage } from 'next'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react-17'

const InboxPopupMenuDefault: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu />
    </div>
  );

}

export default InboxPopupMenuDefault;

