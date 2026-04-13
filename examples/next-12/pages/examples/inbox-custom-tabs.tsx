import { useEffect } from 'react'
import type { NextPage } from 'next'
import {
  CourierInbox,
  useCourier,
  type CourierInboxFeed,
} from '@trycourier/courier-react-17'
import { getSignInProps } from '../../courier-env'

const InboxCustomTabs: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn(getSignInProps());
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

export default InboxCustomTabs;

