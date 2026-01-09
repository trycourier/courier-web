'use client';

import { CourierInbox, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { createMessageClickHandler, createMessageActionClickHandler } from './inboxHandlers';
import type { ColorMode } from './ThemeTab';

interface CourierInboxTabProps {
  feeds: CourierInboxFeed[];
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  colorMode: ColorMode;
}

export function CourierInboxTab({ feeds, lightTheme, darkTheme, colorMode }: CourierInboxTabProps) {
  const componentKey = useInboxComponentKey(feeds, lightTheme, darkTheme, colorMode);
  const handleMessageClick = createMessageClickHandler();
  const handleMessageActionClick = createMessageActionClickHandler();

  return (
    <div className="h-full">
      <CourierInbox
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

