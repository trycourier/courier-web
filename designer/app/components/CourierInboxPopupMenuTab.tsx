'use client';

import { CourierInboxPopupMenu, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { createMessageClickHandler } from './inboxHandlers';

interface CourierInboxPopupMenuTabProps {
  feeds: CourierInboxFeed[];
  theme?: CourierInboxTheme;
}

export function CourierInboxPopupMenuTab({ feeds, theme }: CourierInboxPopupMenuTabProps) {
  const componentKey = useInboxComponentKey(feeds, theme);
  const handleMessageClick = createMessageClickHandler();

  return (
    <div className="h-full p-4">
      <CourierInboxPopupMenu
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

