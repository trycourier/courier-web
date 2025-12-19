'use client';

import { CourierInbox, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { createMessageClickHandler } from './inboxHandlers';

interface CourierInboxTabProps {
  feeds: CourierInboxFeed[];
  theme?: CourierInboxTheme;
}

export function CourierInboxTab({ feeds, theme }: CourierInboxTabProps) {
  const componentKey = useInboxComponentKey(feeds, theme);
  const handleMessageClick = createMessageClickHandler();

  return (
    <div className="h-full">
      <CourierInbox 
        key={componentKey} 
        feeds={feeds} 
        onMessageClick={handleMessageClick}
        lightTheme={theme}
        darkTheme={theme}
        mode="light"
      />
    </div>
  );
}

