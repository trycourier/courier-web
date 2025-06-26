import { useEffect } from 'react'
import { 
  CourierInbox, 
  useCourier, 
  type CourierInboxStateEmptyFactoryProps,
  type CourierInboxStateLoadingFactoryProps,
  type CourierInboxStateErrorFactoryProps,
  type CourierInboxPaginationItemFactoryProps
} from '@trycourier/courier-react'

const CustomLoadingState = ({ feedType }: CourierInboxStateLoadingFactoryProps) => (
  <div style={{
    padding: '24px',
    background: 'red',
    textAlign: 'center'
  }}>
    Custom Loading State
  </div>
);

const CustomEmptyState = ({ feedType }: CourierInboxStateEmptyFactoryProps) => (
  <div style={{
    padding: '24px',
    background: 'green',
    textAlign: 'center'
  }}>
    Custom Empty State
  </div>
);

const CustomErrorState = ({ feedType, error }: CourierInboxStateErrorFactoryProps) => (
  <div style={{
    padding: '24px',
    background: 'blue',
    textAlign: 'center'
  }}>
    Custom Error State: {error.message}
  </div>
);

const CustomPaginationItem = ({ feedType }: CourierInboxPaginationItemFactoryProps) => (
  <div style={{
    padding: '24px',
    background: 'yellow',
    textAlign: 'center'
  }}>
    Custom Pagination Item
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
      renderLoadingState={(props: CourierInboxStateLoadingFactoryProps) => {
        return <CustomLoadingState {...props} />
      }}
      renderEmptyState={(props: CourierInboxStateEmptyFactoryProps) => {
        return <CustomEmptyState {...props} />
      }}
      renderErrorState={(props: CourierInboxStateErrorFactoryProps) => {
        return <CustomErrorState {...props} />
      }}
      renderPaginationItem={(props: CourierInboxPaginationItemFactoryProps) => {
        return <CustomPaginationItem {...props} />
      }}
    />
  );

}
