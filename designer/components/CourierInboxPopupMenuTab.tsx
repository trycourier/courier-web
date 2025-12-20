'use client';

import { CourierInboxPopupMenu, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { createMessageClickHandler } from './inboxHandlers';

interface CourierInboxPopupMenuTabProps {
  feeds: CourierInboxFeed[];
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
}

export function CourierInboxPopupMenuTab({ feeds, lightTheme, darkTheme }: CourierInboxPopupMenuTabProps) {
  const componentKey = useInboxComponentKey(feeds, lightTheme, darkTheme);
  const handleMessageClick = createMessageClickHandler();

  return (
    <div className="h-full p-4">
      <CourierInboxPopupMenu
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

