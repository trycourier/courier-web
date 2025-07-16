import { useRef, useEffect, forwardRef, ReactNode } from "react";
import { CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxTheme, CourierInbox as CourierInboxElement, CourierInboxHeaderFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxFeedType } from "@trycourier/courier-ui-inbox";
import { reactNodeToHTMLElement } from "../utils/utils";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";

export interface CourierInboxProps {
  /** Height of the inbox container. Defaults to "auto" and will resize itself based on it's children. */
  height?: string;

  /** Theme object for light mode */
  lightTheme?: CourierInboxTheme;

  /** Theme object for dark mode */
  darkTheme?: CourierInboxTheme;

  /** Theme mode: "light", "dark", or "system". Defaults to "system" */
  mode?: CourierComponentThemeMode;

  /** Type of feed to display in the inbox ("inbox" or "archive"). Defaults to "inbox" */
  feedType?: CourierInboxFeedType;

  /** Callback fired when a message is clicked. */
  onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;

  /** Callback fired when a message action (e.g., button) is clicked. */
  onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;

  /** Callback fired when a message is long-pressed (for mobile/gesture support). Only works on devices that support touch. */
  onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;

  /** Allows you to pass a custom component as the header. */
  renderHeader?: (props: CourierInboxHeaderFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the list item. */
  renderListItem?: (props: CourierInboxListItemFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the empty state. */
  renderEmptyState?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the loading state. */
  renderLoadingState?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the error state. */
  renderErrorState?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the pagination list item. */
  renderPaginationItem?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => ReactNode;
}

export const CourierInbox = forwardRef<CourierInboxElement, CourierInboxProps>((props, ref) => {
  const inboxRef = useRef<CourierInboxElement | null>(null);

  // Expose the internal ref to the parent if a ref was passed in
  useEffect(() => {
    if (typeof ref === "function") {
      ref(inboxRef.current);
    } else if (ref) {
      (ref as React.RefObject<CourierInboxElement | null>).current = inboxRef.current;
    }
  }, [ref]);

  // Handle message click
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox) return;
    inbox.onMessageClick(props.onMessageClick);
  }, [props.onMessageClick, inboxRef]);

  // Handle message action click
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox) return;
    inbox.onMessageActionClick(props.onMessageActionClick);
  }, [props.onMessageActionClick, inboxRef]);

  // Handle message long press
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox) return;
    inbox.onMessageLongPress(props.onMessageLongPress);
  }, [props.onMessageLongPress, inboxRef]);

  // Render header
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.renderHeader) return;
    queueMicrotask(() => {
      inbox.setHeader((headerProps?: CourierInboxHeaderFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderHeader!(headerProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderHeader, inboxRef]);

  // Render list item
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.renderListItem) return;
    queueMicrotask(() => {
      inbox.setListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderListItem!(itemProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderListItem, inboxRef]);

  // Render empty state
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.renderEmptyState) return;
    queueMicrotask(() => {
      inbox.setEmptyState((emptyStateProps?: CourierInboxStateEmptyFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderEmptyState!(emptyStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderEmptyState, inboxRef]);

  // Render loading state
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.renderLoadingState) return;
    queueMicrotask(() => {
      inbox.setLoadingState((loadingStateProps?: CourierInboxStateLoadingFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderLoadingState!(loadingStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderLoadingState, inboxRef]);

  // Render error state
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.renderErrorState) return;
    queueMicrotask(() => {
      inbox.setErrorState((errorStateProps?: CourierInboxStateErrorFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderErrorState!(errorStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderErrorState, inboxRef]);

  // Render pagination item
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox || !props.renderPaginationItem) return;
    queueMicrotask(() => {
      inbox.setPaginationItem((paginationProps?: CourierInboxPaginationItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPaginationItem!(paginationProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPaginationItem, inboxRef]);

  // Set feed type
  useEffect(() => {
    const inbox = inboxRef.current;
    if (!inbox) return;
    queueMicrotask(() => {
      inbox.setFeedType(props.feedType || 'inbox');
    });
  }, [props.feedType, inboxRef]);

  return (
    <CourierClientComponent>
      {/* @ts-ignore */}
      <courier-inbox
        ref={inboxRef}
        height={props.height}
        light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
        dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
        mode={props.mode}
      />
    </CourierClientComponent>
  );
});

CourierInbox.displayName = 'CourierInbox';