import { useEffect } from 'react';
import { useCourier, CourierInbox } from '@trycourier/courier-react';
import { Link } from 'react-router-dom';
import { getSignInProps } from './courier-env';

export default function Home() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
  }, []);

  const handleMessageClick = (props: any) => {
    alert(JSON.stringify(props, null, 2));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/examples" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          View All Examples →
        </Link>
      </div>
      <CourierInbox onMessageClick={handleMessageClick} />
    </div>
  );

}

