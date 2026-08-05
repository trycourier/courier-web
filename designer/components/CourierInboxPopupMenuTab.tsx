'use client';

import { useRef, useEffect } from 'react';
import { CourierInboxPopupMenu, type CourierInboxFeed, type CourierInboxTheme, type CourierInboxPopupMenuElement } from '@trycourier/courier-react';
import { useInboxComponentKey } from './useInboxComponentKey';
import { useMessageClickHandlers } from './messageClickHandlers';
import type { ColorMode } from './ThemeTab';

interface CourierInboxPopupMenuTabProps {
  feeds: CourierInboxFeed[];
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  colorMode: ColorMode;
}

export function CourierInboxPopupMenuTab({ feeds, lightTheme, darkTheme, colorMode }: CourierInboxPopupMenuTabProps) {
  const componentKey = useInboxComponentKey(feeds, lightTheme, darkTheme, colorMode);
  const { onMessageClick, onMessageActionClick } = useMessageClickHandlers();
  const popupRef = useRef<CourierInboxPopupMenuElement>(null);

  // Open the popup by default when the component mounts
  useEffect(() => {
    // Small delay to ensure the element is fully rendered
    const timer = setTimeout(() => {
      if (popupRef.current) {
        popupRef.current.showPopup();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [componentKey]);

  return (
    <div className="h-full p-4">
      <CourierInboxPopupMenu
        ref={popupRef}
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

