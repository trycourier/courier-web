'use client'

import { useEffect } from 'react'
import {
  CourierInbox,
  useCourier,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-react';
import { getSignInProps } from '../../../courier-env';

const CustomListItem = ({ message, index }: CourierInboxListItemFactoryProps) => (
  <pre style={{
    padding: '24px',
    borderBottom: '1px solid #e0e0e0',
    margin: '0'
  }}>
    {JSON.stringify({ message, index }, null, 2)}
  </pre>
);

export default function CustomListItems() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  return (
    <CourierInbox
      renderListItem={(props: CourierInboxListItemFactoryProps | null | undefined) => {
        if (!props) return <></>;
        return <CustomListItem {...props} />;
      }}
    />
  );

}

