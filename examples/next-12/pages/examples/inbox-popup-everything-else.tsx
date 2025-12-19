import { useEffect } from 'react'
import type { NextPage } from 'next'
import {
  CourierInbox,
  useCourier,
  type CourierInboxStateEmptyFactoryProps,
  type CourierInboxStateLoadingFactoryProps,
  type CourierInboxStateErrorFactoryProps,
  type CourierInboxPaginationItemFactoryProps,
} from '@trycourier/courier-react-17';

const CustomLoadingState = ({ datasetId }: CourierInboxStateLoadingFactoryProps) => (
  <div style={{
    width: '100%',
    padding: '24px',
    background: 'red',
    textAlign: 'center'
  }}>
    Custom Loading State
  </div>
);

const CustomEmptyState = ({ datasetId }: CourierInboxStateEmptyFactoryProps) => (
  <div style={{
    width: '100%',
    padding: '24px',
    background: 'green',
    textAlign: 'center'
  }}>
    Custom Empty State
  </div>
);

const CustomErrorState = ({ datasetId, error }: CourierInboxStateErrorFactoryProps) => (
  <div style={{
    width: '100%',
    padding: '24px',
    background: 'blue',
    textAlign: 'center'
  }}>
    Custom Error State: {error.message}
  </div>
);

const CustomPaginationItem = ({ datasetId }: CourierInboxPaginationItemFactoryProps) => (
  <div style={{
    padding: '24px',
    background: 'yellow',
    textAlign: 'center'
  }}>
    Custom Pagination Item
  </div>
);

const CustomOther: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  return (
    <CourierInbox
      renderLoadingState={(props: CourierInboxStateLoadingFactoryProps | null | undefined) => {
        if (!props) return <></>;

        return <CustomLoadingState {...props} />;
      }}
      renderEmptyState={(props: CourierInboxStateEmptyFactoryProps | null | undefined) => {
        if (!props) return <></>;

        return <CustomEmptyState {...props} />
      }}
      renderErrorState={(props: CourierInboxStateErrorFactoryProps | null | undefined) => {
        if (!props) return <></>;

        return <CustomErrorState {...props} />
      }}
      renderPaginationItem={(props: CourierInboxPaginationItemFactoryProps | null | undefined) => {
        if (!props) return <></>;

        return <CustomPaginationItem {...props} />
      }}
    />
  );

}

export default CustomOther;

