'use client';

import { CourierInbox, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { createMessageClickHandler } from './inboxHandlers';

interface CourierInboxTabProps {
  feeds: CourierInboxFeed[];
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
}

export function CourierInboxTab({ feeds, lightTheme, darkTheme }: CourierInboxTabProps) {
  const componentKey = useInboxComponentKey(feeds, lightTheme, darkTheme);
  const handleMessageClick = createMessageClickHandler();

  return (
    <div className="h-full">
      <CourierInbox 
        key={componentKey} 
        feeds={feeds} 
        onMessageClick={handleMessageClick}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        mode="system"
      />
    </div>
  );
}

