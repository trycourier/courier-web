import React, { useMemo } from "react";
import { CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxTheme } from "@trycourier/courier-ui-inbox";
import { serializeHandler } from "../utils/utils";

export interface CourierInboxProps {
  height?: string;
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  mode?: 'light' | 'dark' | 'system';
  onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;
  onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;
  onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;
}

export const CourierInbox: React.FC<CourierInboxProps> = (props) => {

  // Serialized handlers
  // This is necessary because the web component expects a string, not a function
  const clickAttr = useMemo(() => serializeHandler(props.onMessageClick), [props.onMessageClick]);
  const actionClickAttr = useMemo(() => serializeHandler(props.onMessageActionClick), [props.onMessageActionClick]);
  const longPressAttr = useMemo(() => serializeHandler(props.onMessageLongPress), [props.onMessageLongPress]);

  return (
    <courier-inbox
      height={props.height}
      message-click={clickAttr}
      message-action-click={actionClickAttr}
      message-long-press={longPressAttr}
      light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
      dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
      mode={props.mode}
    />
  );

};