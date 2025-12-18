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
      id: 'notifications',
      title: 'Notifications',
      tabs: [
        {
          id: 'all-notifications',
          title: 'All',
          filter: {}
        },
        {
          id: 'unread-notifications',
          title: 'Unread',
          filter: { status: 'unread' }
        },
        {
          id: 'important',
          title: 'Important',
          filter: { tags: ['important'] }
        }
      ]
    },
    {
      id: 'archived',
      title: 'Archived',
      tabs: [
        {
          id: 'archived-messages',
          title: 'Archived',
          filter: { archived: true }
        }
      ]
    }
  ];

  return <CourierInbox feeds={feeds} />;

}
