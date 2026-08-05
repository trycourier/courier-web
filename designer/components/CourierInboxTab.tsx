'use client';

import { CourierInbox, type CourierInboxFeed, type CourierInboxTheme } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { useMessageClickHandlers } from './messageClickHandlers';
import type { ColorMode } from './ThemeTab';

interface CourierInboxTabProps {
  feeds: CourierInboxFeed[];
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  colorMode: ColorMode;
}

export function CourierInboxTab({ feeds, lightTheme, darkTheme, colorMode }: CourierInboxTabProps) {
  const componentKey = useInboxComponentKey(feeds, lightTheme, darkTheme, colorMode);
  const { onMessageClick, onMessageActionClick } = useMessageClickHandlers();

  return (
    <div className="h-full">
      <CourierInbox
        key={componentKey}
        feeds={feeds}
        onMessageClick={onMessageClick}
        onMessageActionClick={onMessageActionClick}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        mode={colorMode}
      />
    </div>
  );
}

