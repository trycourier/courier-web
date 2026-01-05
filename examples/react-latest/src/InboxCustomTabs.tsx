import { useEffect } from 'react'
import {
  CourierInbox,
  useCourier,
  type CourierInboxFeed,
} from '@trycourier/courier-react'

export default function InboxCustomTabs() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  // Single feed with multiple tabs for filtering
  const feeds: CourierInboxFeed[] = [
    {
      feedId: 'notifications',
      title: 'Notifications',
      tabs: [
        {
          datasetId: 'all-notifications',
          title: 'All',
          filter: {}
        },
        {
          datasetId: 'unread-notifications',
          title: 'Unread',
          filter: { status: 'unread' }
        },
        {
          datasetId: 'read-notifications',
          title: 'Read',
          filter: { status: 'read' }
        },
        {
          datasetId: 'important',
          title: 'Important',
          filter: { tags: ['important'] }
        },
        {
          datasetId: 'archived',
          title: 'Archived',
          filter: { archived: true }
        }
      ]
    }
  ];

  return <CourierInbox feeds={feeds} />;

}

