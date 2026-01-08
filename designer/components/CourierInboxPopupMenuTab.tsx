'use client';

import { CourierInboxPopupMenu, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { createMessageClickHandler, createMessageActionClickHandler } from './inboxHandlers';
import type { ColorMode } from './ThemeTab';

interface CourierInboxPopupMenuTabProps {
  feeds: CourierInboxFeed[];
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  colorMode: ColorMode;
}

export function CourierInboxPopupMenuTab({ feeds, lightTheme, darkTheme, colorMode }: CourierInboxPopupMenuTabProps) {
  const componentKey = useInboxComponentKey(feeds, lightTheme, darkTheme, colorMode);
  const handleMessageClick = createMessageClickHandler();
  const handleMessageActionClick = createMessageActionClickHandler();

  return (
    <div className="h-full p-4">
      <CourierInboxPopupMenu
        key={componentKey}
        feeds={feeds}
        onMessageClick={handleMessageClick}
        onMessageActionClick={handleMessageActionClick}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        mode={colorMode}
      />
    </div>
  );
}

