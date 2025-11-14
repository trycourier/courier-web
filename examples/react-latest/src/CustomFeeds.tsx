import { useEffect } from 'react'
import { CourierInbox, type CourierInboxFeed, useCourier } from '@trycourier/courier-react'

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
      label: 'Notifications',
      tabs: [
        {
          id: 'all-notifications',
          label: 'All',
          filter: {}
        },
        {
          id: 'unread-notifications',
          label: 'Unread',
          filter: { status: 'unread' }
        }
      ]
    },
    {
      id: 'archived',
      label: 'Archived',
      tabs: [
        {
          id: 'archived-messages',
          label: 'Archived',
          filter: { archived: true }
        }
      ]
    }
  ];

  return <CourierInbox feeds={feeds} />;

}
