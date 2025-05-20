import React, { useMemo, useRef, useEffect } from "react";
import { CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxTheme, CourierInbox as CourierInboxElement } from "@trycourier/courier-ui-inbox";
import { reactNodeToHTMLElement, serializeHandler } from "../utils/utils";

export interface CourierInboxProps {
  height?: string;
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  mode?: 'light' | 'dark' | 'system';
  onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;
  onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;
  onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;
  listItemFactory?: (props: CourierInboxListItemFactoryProps | undefined | null) => React.ReactNode;
}

export const CourierInbox: React.FC<CourierInboxProps> = (props) => {
  const inboxRef = useRef<CourierInboxElement>(null);

  // Serialized handlers
  // This is necessary because the web component expects a string, not a function
  const clickAttr = useMemo(() => serializeHandler(props.onMessageClick), [props.onMessageClick]);
  const actionClickAttr = useMemo(() => serializeHandler(props.onMessageActionClick), [props.onMessageActionClick]);
  const longPressAttr = useMemo(() => serializeHandler(props.onMessageLongPress), [props.onMessageLongPress]);

  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.listItemFactory) return;

    // Defer factory setup until *after* current render
    // This is necessary because React will not update the DOM until the next render
    queueMicrotask(() => {
      inbox.setListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.listItemFactory!(itemProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });

  }, [props.listItemFactory]);

  return (
    <courier-inbox
      ref={inboxRef}
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