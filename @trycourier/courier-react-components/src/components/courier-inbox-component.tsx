import { useRef, useEffect, forwardRef, ReactNode, useContext, useState } from "react";
import { CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxTheme, CourierInbox as CourierInboxElement, CourierInboxHeaderFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxFeed } from "@trycourier/courier-ui-inbox";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";
import { CourierRenderContext } from "../context/render-context";

export interface CourierInboxProps {
  /** Height of the inbox container. Defaults to "auto" and will resize itself based on it's children. */
  height?: string;

  /** Theme object for light mode */
  lightTheme?: CourierInboxTheme;

  /** Theme object for dark mode */
  darkTheme?: CourierInboxTheme;

  /** Theme mode: "light", "dark", or "system". Defaults to "system" */
  mode?: CourierComponentThemeMode;

  /** Type of feed to display in the inbox. Defaults to "inbox" */
  feedType?: string;

  /** Array of feeds to display in the inbox. Each feed contains tabs with different filters. */
  feeds?: CourierInboxFeed[];

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

export const CourierInboxComponent = forwardRef<CourierInboxElement, CourierInboxProps>((props, ref) => {
  const render = useContext(CourierRenderContext);
  if (!render) {
    throw new Error("RenderContext not found. Ensure CourierInbox is wrapped in a CourierRenderContext.");
  }

  // Element ref for use in effects, updated by handleRef.
  const inboxRef = useRef<CourierInboxElement | null>(null);
  const [elementReady, setElementReady] = useState(false);
  const feedsSetRef = useRef(false);

  // Callback ref passed to rendered component, used to propagate the DOM element's ref to the parent component.
  // We use a callback ref (rather than a React.RefObject) since we want the parent ref to be up-to-date with
  // rendered component. Updating the parent ref via useEffect does not work, since mutating a RefObject
  // does not trigger useEffect (see https://stackoverflow.com/a/60476525).
  function handleRef(el: CourierInboxElement | null) {
    if (ref) {

      // Propagate ref to ref callback functions
      if (typeof ref === 'function') {
        ref(el);
      } else {
        // Propagate ref to ref objects
        // @ts-ignore - RefObject.current is readonly in React 17, however it's not frozen and is equivalent the widened type MutableRefObject
        (ref as React.RefObject<CourierInboxElement | null>).current = el;
      }
    }

    // Store the element for use in effects
    inboxRef.current = el;

    // Update element ready state
    setElementReady(!!el);
  }

  // Helper to get the current element
  function getEl(): CourierInboxElement | null {
    return inboxRef.current;
  }

  // Handle message click
  useEffect(() => {
    const inbox = getEl();
    if (!inbox) return;
    inbox.onMessageClick(props.onMessageClick);
  }, [props.onMessageClick, elementReady]);

  // Handle message action click
  useEffect(() => {
    const inbox = getEl();
    if (!inbox) return;
    inbox.onMessageActionClick(props.onMessageActionClick);
  }, [props.onMessageActionClick, elementReady]);

  // Handle message long press
  useEffect(() => {
    const inbox = getEl();
    if (!inbox) return;
    inbox.onMessageLongPress(props.onMessageLongPress);
  }, [props.onMessageLongPress, elementReady]);

  // Render header
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderHeader) return;
    queueMicrotask(() => {
      inbox.setHeader((headerProps?: CourierInboxHeaderFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderHeader!(headerProps);
        return render(reactNode);
      });
    });
  }, [props.renderHeader, elementReady]);

  // Render list item
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderListItem) return;
    queueMicrotask(() => {
      inbox.setListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderListItem!(itemProps);
        return render(reactNode);
      });
    });
  }, [props.renderListItem, elementReady]);

  // Render empty state
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderEmptyState) return;
    queueMicrotask(() => {
      inbox.setEmptyState((emptyStateProps?: CourierInboxStateEmptyFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderEmptyState!(emptyStateProps);
        return render(reactNode);
      });
    });
  }, [props.renderEmptyState, elementReady]);

  // Render loading state
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderLoadingState) return;
    queueMicrotask(() => {
      inbox.setLoadingState((loadingStateProps?: CourierInboxStateLoadingFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderLoadingState!(loadingStateProps);
        return render(reactNode);
      });
    });
  }, [props.renderLoadingState, elementReady]);

  // Render error state
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderErrorState) return;
    queueMicrotask(() => {
      inbox.setErrorState((errorStateProps?: CourierInboxStateErrorFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderErrorState!(errorStateProps);
        return render(reactNode);
      });
    });
  }, [props.renderErrorState, elementReady]);

  // Render pagination item
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderPaginationItem) return;
    queueMicrotask(() => {
      inbox.setPaginationItem((paginationProps?: CourierInboxPaginationItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPaginationItem!(paginationProps);
        return render(reactNode);
      });
    });
  }, [props.renderPaginationItem, elementReady]);

  // Set feeds (only once when element is ready)
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.feeds || feedsSetRef.current) return;
    feedsSetRef.current = true;
    queueMicrotask(() => {
      inbox.setFeeds(props.feeds!);
    });
  }, [props.feeds, elementReady]);

  const children = (
    /* @ts-ignore */
    <courier-inbox
      ref={handleRef}
      height={props.height}
      light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
      dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
      mode={props.mode}
    />
  );

  return (
    <CourierClientComponent children={children} />
  );
});
