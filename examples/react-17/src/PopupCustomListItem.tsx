import { useEffect } from 'react'
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-react-17';

const CustomListItem = ({ message, index }: CourierInboxListItemFactoryProps) => (
  <pre style={{
    padding: '24px',
    borderBottom: '1px solid #e0e0e0',
    margin: '0'
  }}>
    {JSON.stringify({ message, index }, null, 2)}
  </pre>
);

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
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

