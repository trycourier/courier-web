'use client'

import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

export default function CustomHeight() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  return <CourierInbox height='50vh' />;

}

