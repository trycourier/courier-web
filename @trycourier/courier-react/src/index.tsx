// Imports the courier-inbox web component
import "@trycourier/courier-ui-inbox";

// Other imports
import React from "react";
import { Courier } from "@trycourier/courier-js";

export interface CourierInboxProps {
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
  mode,
}) => (
  <courier-inbox
    height={height}
    message-click={messageClick ? 'true' : undefined}
    light-theme={lightTheme && JSON.stringify(lightTheme)}
    dark-theme={darkTheme && JSON.stringify(darkTheme)}
    mode={mode}
  />
);

export const useCourier = () => Courier.shared;