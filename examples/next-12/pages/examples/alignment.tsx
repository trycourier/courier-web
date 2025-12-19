import { useEffect } from 'react'
import type { NextPage } from 'next'
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-react-17'

const Alignment: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
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

export default Alignment;

