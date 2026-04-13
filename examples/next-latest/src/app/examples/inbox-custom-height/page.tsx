'use client'

import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'
import { getSignInProps } from '../../../courier-env'

export default function CustomHeight() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
  }, []);

  return <CourierInbox height='50vh' />;

}

