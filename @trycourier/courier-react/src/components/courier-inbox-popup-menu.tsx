import { useRef, useEffect, forwardRef, ReactNode } from "react";
import { CourierInboxFeedType, CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxPopupMenu as CourierInboxPopupMenuElement, CourierInboxPaginationItemFactoryProps, CourierInboxPopupAlignment, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxTheme } from "@trycourier/courier-ui-inbox";
import { reactNodeToHTMLElement } from "../utils/utils";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";

export interface CourierInboxPopupMenuProps {
  /** Alignment of the popup menu: "top-right", "top-left", "top-center", "bottom-right", "bottom-left", "bottom-center", "center-right", "center-left", "center-center". */
  popupAlignment?: CourierInboxPopupAlignment;

  /** Width of the popup menu container. */
  popupWidth?: string;

  /** Height of the popup menu container. */
  popupHeight?: string;

  /** CSS left position for the popup menu. */
  left?: string;

  /** CSS top position for the popup menu. */
  top?: string;

  /** CSS right position for the popup menu. */
  right?: string;

  /** CSS bottom position for the popup menu. */
  bottom?: string;

  /** Theme object for light mode. */
  lightTheme?: CourierInboxTheme;

  /** Theme object for dark mode. */
  darkTheme?: CourierInboxTheme;

  /** Theme mode: "light", "dark", or "system". */
  mode?: CourierComponentThemeMode;

  /** Type of feed to display in the popup menu ("inbox" or "archive"). */
  feedType?: CourierInboxFeedType;

  /** Callback fired when a message is clicked. */
  onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;

  /** Callback fired when a message action (e.g., button) is clicked. */
  onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;

  /** Callback fired when a message is long-pressed (for mobile/gesture support). */
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

  /** Allows you to pass a custom component as the menu button. */
  renderMenuButton?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => ReactNode;
}

export const CourierInboxPopupMenu = forwardRef<CourierInboxPopupMenuElement, CourierInboxPopupMenuProps>((props, ref) => {
  const menuRef = useRef<CourierInboxPopupMenuElement>(null);

  // Expose the internal ref to the parent if a ref was passed in
  useEffect(() => {
    if (typeof ref === "function") {
      ref(menuRef.current);
    } else if (ref) {
      (ref as React.RefObject<CourierInboxPopupMenuElement | null>).current = menuRef.current;
    }
  }, [ref]);

  // Handle message click
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    menu.onMessageClick(props.onMessageClick);
  }, [props.onMessageClick, menuRef]);

  // Handle message action click
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    menu.onMessageActionClick(props.onMessageActionClick);
  }, [props.onMessageActionClick, menuRef]);

  // Handle message long press
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    menu.onMessageLongPress(props.onMessageLongPress);
  }, [props.onMessageLongPress, menuRef]);

  // Render header
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderHeader) return;
    queueMicrotask(() => {
      menu.setHeader((headerProps?: CourierInboxHeaderFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderHeader!(headerProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderHeader, menuRef]);

  // Render list item
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderListItem) return;
    queueMicrotask(() => {
      menu.setListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderListItem!(itemProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderListItem, menuRef]);

  // Render empty state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderEmptyState) return;
    queueMicrotask(() => {
      menu.setEmptyState((emptyStateProps?: CourierInboxStateEmptyFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderEmptyState!(emptyStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderEmptyState, menuRef]);

  // Render loading state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderLoadingState) return;
    queueMicrotask(() => {
      menu.setLoadingState((loadingStateProps?: CourierInboxStateLoadingFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderLoadingState!(loadingStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderLoadingState, menuRef]);

  // Render error state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderErrorState) return;
    queueMicrotask(() => {
      menu.setErrorState((errorStateProps?: CourierInboxStateErrorFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderErrorState!(errorStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderErrorState, menuRef]);

  // Render pagination item
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPaginationItem) return;
    queueMicrotask(() => {
      menu.setPaginationItem((paginationProps?: CourierInboxPaginationItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPaginationItem!(paginationProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPaginationItem, menuRef]);

  // Render menu button
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderMenuButton) return;
    queueMicrotask(() => {
      menu.setMenuButton((buttonProps?: CourierInboxMenuButtonFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderMenuButton!(buttonProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderMenuButton, menuRef]);

  // Set feed type
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    queueMicrotask(() => {
      menu.setFeedType(props.feedType || 'inbox');
    });
  }, [props.feedType, menuRef]);

  return (
    <CourierClientComponent>
      {/* @ts-ignore */}
      <courier-inbox-popup-menu
        ref={menuRef}
        popup-alignment={props.popupAlignment}
        popup-width={props.popupWidth}
        popup-height={props.popupHeight}
        left={props.left}
        top={props.top}
        right={props.right}
        bottom={props.bottom}
        light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
        dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
        mode={props.mode}
      />
    </CourierClientComponent>
  );
});

CourierInboxPopupMenu.displayName = 'CourierInboxPopupMenu';