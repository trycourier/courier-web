import { useEffect, useRef } from 'react'
import {
  CourierInbox,
  useCourier,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxFeed,
  type CourierInboxElement,
} from '@trycourier/courier-react';

const CustomHeader = (props: CourierInboxHeaderFactoryProps) => {
  const selectedFeed = props.feeds.find(feed => feed.isSelected);
  const selectedTab = selectedFeed?.tabs.find(tab => tab.isSelected);

  return (
    <div style={{
      background: 'red',
      fontSize: '24px',
      padding: '24px',
      width: '100%'
    }}>
      {selectedFeed?.feedId ?? ''} - {selectedTab?.datasetId ?? ''} - {selectedTab?.unreadCount ?? 0}
    </div>
  );
};

export default function App() {

  const courier = useCourier();
  const inboxRef = useRef<CourierInboxElement>(null);

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });
  }, []);

  useEffect(() => {
    if (inboxRef.current) {
      // Remove the header
      inboxRef.current.removeHeader();

      // Select the feed and tab
      inboxRef.current.selectFeed('archive');
      inboxRef.current.selectTab('archive_2');
    }
  }, [inboxRef.current]);

  const feeds: CourierInboxFeed[] = [
    {
      feedId: 'inbox',
      title: 'Inbox',
      tabs: [
        { datasetId: 'inbox', title: 'Inbox', filter: {} }
      ]
    },
    {
      feedId: 'archive',
      title: 'Archive',
      tabs: [
        { datasetId: 'archive_1', title: 'Archive 1', filter: { archived: true } },
        { datasetId: 'archive_2', title: 'Archive 2', filter: { archived: true } }
      ]
    }
  ];

  return (
    <CourierInbox
      ref={inboxRef}
      feeds={feeds}
      renderHeader={props => {
        if (!props) return <></>;
        return <CustomHeader {...props} />;
      }}
    />
  );

}
