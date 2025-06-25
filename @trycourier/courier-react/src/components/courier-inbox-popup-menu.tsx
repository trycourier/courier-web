import { useRef, useEffect, JSX, forwardRef } from "react";
import { CourierInboxFeedType, CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxPopupMenu as CourierInboxPopupMenuElement, CourierInboxPaginationItemFactoryProps, CourierInboxPopupAlignment, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxTheme } from "@trycourier/courier-ui-inbox";
import { reactNodeToHTMLElement } from "../utils/utils";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";

export interface CourierInboxPopupMenuProps {
  popupAlignment?: CourierInboxPopupAlignment;
  popupWidth?: string;
  popupHeight?: string;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  lightTheme?: CourierInboxTheme;
  darkTheme?: CourierInboxTheme;
  mode?: CourierComponentThemeMode;
  feedType?: CourierInboxFeedType;
  onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;
  onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;
  onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;
  renderHeader?: (props: CourierInboxHeaderFactoryProps | undefined | null) => JSX.Element;
  renderListItem?: (props: CourierInboxListItemFactoryProps | undefined | null) => JSX.Element;
  renderEmptyState?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => JSX.Element;
  renderLoadingState?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => JSX.Element;
  renderErrorState?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => JSX.Element;
  renderPaginationItem?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => JSX.Element;
  renderMenuButton?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => JSX.Element;
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