'use client';

import { useEffect, useRef } from 'react';
import { useCourier, type InboxMessage, type CourierInboxFeed } from '@trycourier/courier-react';

interface CourierInboxHooksProps {
  feeds: CourierInboxFeed[];
}

export function CourierInboxHooks({ feeds }: CourierInboxHooksProps) {
  const { inbox } = useCourier();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Note: Authentication is handled by CourierAuth component
    // This component just loads the inbox data

    async function loadInbox() {
      inbox.registerFeeds(feeds);

      // Only initialize once
      if (!initializedRef.current) {
        // Set up socket listener for real-time updates
        await inbox.listenForUpdates();
        initializedRef.current = true;
      }

      // Load the initial inbox data
      await inbox.load();

      // Fetch all pages of messages if possible
      const firstDatasetId = feeds[0]?.tabs[0]?.datasetId || 'all_messages';
      const fetchNextPageOfMessages = async () => {
        const nextPage = await inbox.fetchNextPageOfMessages({ datasetId: firstDatasetId });
        if (nextPage && nextPage.canPaginate) {
          await fetchNextPageOfMessages();
        }
      };
      await fetchNextPageOfMessages();
    }

    loadInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeds]); // Re-run when feeds change, but only initialize socket once

  // Use the first dataset from the first feed's first tab
  const firstDatasetId = feeds[0]?.tabs[0]?.datasetId || 'all_messages';
  const messages = inbox.feeds[firstDatasetId]?.messages || [];

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Total Unread Count: {inbox.totalUnreadCount ?? 0}
        </div>
        {inbox.error && (
          <div className="text-sm text-red-600 dark:text-red-400 mb-2">
            Error: {inbox.error.message}
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {messages.map((message: InboxMessage) => (
          <li
            key={message.messageId}
            className={`p-3 rounded-md border ${message.read
              ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800'
              }`}
          >
            <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
              {JSON.stringify(message, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
      {messages.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No messages found
        </div>
      )}
    </div>
  );
}

