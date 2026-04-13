'use client'

import { useEffect } from 'react'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react'
import { getSignInProps } from '../../../courier-env'

export default function Alignment() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
      <CourierInboxPopupMenu
        popupAlignment="top-right" // 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center'
        popupWidth="340px"
        popupHeight="400px"
        top="44px"
        right="44px"
      />
    </div>
  );

}

