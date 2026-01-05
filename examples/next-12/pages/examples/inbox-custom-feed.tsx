import { useEffect } from 'react'
import type { NextPage } from 'next'
import {
  CourierInbox,
  useCourier,
  type CourierInboxFeed,
} from '@trycourier/courier-react-17'

const InboxCustomFeed: NextPage = () => {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
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
    }
  ];

  return <CourierInbox feeds={feeds} />;

}

export default InboxCustomFeed;

