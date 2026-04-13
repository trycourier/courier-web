import { useEffect } from 'react'
import type { NextPage } from 'next'
import { CourierInbox, useCourier } from '@trycourier/courier-react-17'
import { getSignInProps } from '../../courier-env'

const InboxDefault: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
  }, []);

  return <CourierInbox />;

}

export default InboxDefault;

