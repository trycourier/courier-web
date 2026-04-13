'use client'

import { useEffect } from 'react'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react'
import { getSignInProps } from '../../../courier-env'

export default function InboxPopupMenuDefault() {

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

