import { useEffect } from 'react'
import { CourierInbox, useCourier, type CourierInboxHeaderFactoryProps } from '@trycourier/courier-react'

const CustomHeader = (props: CourierInboxHeaderFactoryProps) => (
  <div style={{
    background: 'red',
    fontSize: '24px',
    padding: '24px',
    width: '100%'
  }}>
    {props.feedType}
  </div>
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
    <CourierInbox
      renderHeader={(props: CourierInboxHeaderFactoryProps) => {
        return <CustomHeader {...props} />
      }}
    />
  );

}
