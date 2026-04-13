import { useEffect } from 'react';
import type { NextPage } from 'next'
import { useCourier, CourierInboxPopupMenu } from '@trycourier/courier-react';
import { getSignInProps } from '../../courier-env';

const Home: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps({ showLogs: false }));
  }, []);

  return (
    <div className='center'>
      <CourierInboxPopupMenu />
    </div>
  )
}

export default Home;
