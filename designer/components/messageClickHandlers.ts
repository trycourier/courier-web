'use client';

import { useCallback } from 'react';
import type { InboxAction, InboxMessage } from '@trycourier/courier-react';
import { usePayloadDialog } from './PayloadDialog';

/**
 * Click handlers shared by the inbox, popup-menu and toast previews. Every click
 * opens the payload dialog so the demo shows the data the SDK handed back.
 */
export function useMessageClickHandlers() {
  const { showPayload } = usePayloadDialog();

  const onMessageClick = useCallback(({ message }: { message: InboxMessage }) => {
    showPayload({
      title: 'Message clicked',
      sections: [{ label: 'Message', data: message }],
    });
  }, [showPayload]);

  const onMessageActionClick = useCallback(({ action, message }: { action: InboxAction; message: InboxMessage }) => {
    showPayload({
      title: 'Action clicked',
      sections: [
        { label: 'Action', data: action },
        { label: 'Message', data: message },
      ],
    });
  }, [showPayload]);

  return { onMessageClick, onMessageActionClick };
}
