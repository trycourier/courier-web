'use client';

import { useEffect, useRef } from 'react';
import { useCourier, type InboxMessage, type CourierInboxFeed } from '@trycourier/courier-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4 space-y-2">
          <div className="text-sm font-medium">
            Total Unread Count: <Badge variant="secondary">{inbox.totalUnreadCount ?? 0}</Badge>
          </div>
          {inbox.error && (
            <Alert variant="destructive">
              <AlertDescription>Error: {inbox.error.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <ul className="space-y-2">
          {messages.map((message: InboxMessage) => (
            <Card
              key={message.messageId}
              className={message.read ? '' : 'border-primary'}
            >
              <CardContent className="p-3">
                <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(message, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </ul>
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}

