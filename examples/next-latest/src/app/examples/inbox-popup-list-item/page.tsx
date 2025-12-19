'use client'

import { useEffect } from 'react'
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-react';

const CustomListItem = ({ message, index }: CourierInboxListItemFactoryProps) => (
  <pre style={{
    padding: '24px',
    borderBottom: '1px solid #e0e0e0',
    margin: '0'
  }}>
    {JSON.stringify({ message, index }, null, 2)}
  </pre>
);

export default function PopupCustomListItem() {

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
      <CourierInboxPopupMenu
        renderListItem={(props: CourierInboxListItemFactoryProps | null | undefined) => {
          if (!props) return <></>;
          return <CustomListItem {...props} />;
        }}
      />
    </div>
  );

}

