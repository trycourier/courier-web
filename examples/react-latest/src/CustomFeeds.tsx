import { useEffect } from 'react'
import {
  CourierInbox,
  useCourier,
  type CourierInboxFeed,
} from '@trycourier/courier-react'

export default function CustomFeeds() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

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
          datasetId: 'important',
          title: 'Important',
          filter: { tags: ['important'] }
        }
      ]
    },
    {
      feedId: 'archived',
      title: 'Archived',
      tabs: [
        {
          datasetId: 'archived-messages',
          title: 'Archived',
          filter: { archived: true }
        }
      ]
    }
  ];

  return <CourierInbox feeds={feeds} />;

}
