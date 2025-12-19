'use client'

import { useEffect } from 'react'
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxFeed,
} from '@trycourier/courier-react'

export default function PopupCustomFeed() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });
  }, []);

  const feeds: CourierInboxFeed[] = [
    {
      feedId: 'all',
      title: 'All',
      tabs: [
        {
          datasetId: 'all',
          title: 'All',
          filter: {}
        }
      ]
    },
    {
      feedId: 'jobs',
      title: 'Jobs',
      tabs: [
        {
          datasetId: 'jobs',
          title: 'Jobs',
          filter: { tags: ['job'] }
        }
      ]
    },
    {
      feedId: 'my-posts',
      title: 'My Posts',
      tabs: [
        {
          datasetId: 'all-my-posts',
          title: 'All',
          filter: { tags: ['my_post'] }
        },
        {
          datasetId: 'comments',
          title: 'Comments',
          filter: { tags: ['comment'] }
        },
        {
          datasetId: 'reactions',
          title: 'Reactions',
          filter: { tags: ['reaction'] }
        },
        {
          datasetId: 'reposts',
          title: 'Reposts',
          filter: { tags: ['repost'] }
        }
      ]
    },
    {
      feedId: 'mentions',
      title: 'Mentions',
      tabs: [
        {
          datasetId: 'mentions',
          title: 'Mentions',
          filter: { tags: ['mention'] }
        }
      ]
    },
    {
      feedId: 'other',
      title: 'Other',
      tabs: [
        {
          datasetId: 'read',
          title: 'Read',
          filter: { status: 'read' }
        },
        {
          datasetId: 'unread',
          title: 'Unread',
          filter: { status: 'unread' }
        },
        {
          datasetId: 'archived',
          title: 'Archived',
          filter: { archived: true }
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <CourierInboxPopupMenu feeds={feeds} />
    </div>
  );

}

