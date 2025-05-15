import React, { useEffect, useRef } from "react";
import { CourierInbox as CourierInboxElement } from "@trycourier/courier-ui-inbox";

interface CourierInboxProps {
  height?: number;
  messageClick?: (props: any) => void;
  lightTheme?: any;
  darkTheme?: any;
  mode?: string;
}

export const CourierInbox: React.FC<CourierInboxProps> = ({
  height,
  messageClick,
  lightTheme,
  darkTheme,
  mode
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inboxRef = useRef<CourierInboxElement | null>(null);

  // Initialize inbox
  useEffect(() => {
    if (containerRef.current && !inboxRef.current) {
      const inbox = new CourierInboxElement();
      inboxRef.current = inbox;
      containerRef.current.replaceChildren(inbox);
    }
  }, []);

  // Update attributes when props change
  useEffect(() => {
    if (inboxRef.current) {
      if (height) inboxRef.current.setAttribute('height', height.toString());
      if (messageClick) inboxRef.current.setAttribute('message-click', 'true');
      if (lightTheme) inboxRef.current.setAttribute('light-theme', JSON.stringify(lightTheme));
      if (darkTheme) inboxRef.current.setAttribute('dark-theme', JSON.stringify(darkTheme));
      if (mode) inboxRef.current.setAttribute('mode', mode);
    }
  }, [height, messageClick, lightTheme, darkTheme, mode]);

  return <div ref={containerRef}></div>;
};

export { Courier } from "@trycourier/courier-js";
