'use client'

import { useEffect } from 'react'
import { useCourier, type InboxMessage, defaultFeeds } from '@trycourier/courier-react'

export default function Hooks() {

  const { auth, inbox } = useCourier();

  useEffect(() => {

    // Authenticate the user
    auth.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
      showLogs: false,
    });

    // Load the inbox
    loadInbox();

  }, []);

  async function loadInbox() {

    inbox.registerFeeds(defaultFeeds());

    // Set up socket listener for real-time updates
    await inbox.listenForUpdates();

    // Load the initial inbox data
    await inbox.load();

    // Fetch the next page of messages if possible
    await fetchNextPageOfMessages();
  }

  async function fetchNextPageOfMessages() {
    const nextPage = await inbox.fetchNextPageOfMessages({ datasetId: 'all_messages' });
    if (nextPage && nextPage.canPaginate) {
      await fetchNextPageOfMessages();
    }
  }

  return (
    <div>
      <div style={{ padding: '24px' }}>Total Unread Count: {inbox.totalUnreadCount}</div>
      <ul>
        {inbox.feeds['all_messages']?.messages.map((message: InboxMessage) => (
          <li key={message.messageId} style={{ backgroundColor: `${message.read ? 'transparent' : 'red'}` }}>{message.title}</li>
        ))}
      </ul>
    </div>
  );

}

