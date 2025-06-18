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
  renderPopupHeader?: (props: CourierInboxHeaderFactoryProps | undefined | null) => JSX.Element;
  renderPopupListItem?: (props: CourierInboxListItemFactoryProps | undefined | null) => JSX.Element;
  renderPopupEmptyState?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => JSX.Element;
  renderPopupLoadingState?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => JSX.Element;
  renderPopupErrorState?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => JSX.Element;
  renderPopupPaginationItem?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => JSX.Element;
  renderPopupMenuButton?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => JSX.Element;
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
    if (!menu || !props.renderPopupHeader) return;
    queueMicrotask(() => {
      menu.setPopupHeader((headerProps?: CourierInboxHeaderFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupHeader!(headerProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupHeader, menuRef]);

  // Render list item
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPopupListItem) return;
    queueMicrotask(() => {
      menu.setPopupListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupListItem!(itemProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupListItem, menuRef]);

  // Render empty state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPopupEmptyState) return;
    queueMicrotask(() => {
      menu.setPopupEmptyState((emptyStateProps?: CourierInboxStateEmptyFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupEmptyState!(emptyStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupEmptyState, menuRef]);

  // Render loading state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPopupLoadingState) return;
    queueMicrotask(() => {
      menu.setPopupLoadingState((loadingStateProps?: CourierInboxStateLoadingFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupLoadingState!(loadingStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupLoadingState, menuRef]);

  // Render error state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPopupErrorState) return;
    queueMicrotask(() => {
      menu.setPopupErrorState((errorStateProps?: CourierInboxStateErrorFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupErrorState!(errorStateProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupErrorState, menuRef]);

  // Render pagination item
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPopupPaginationItem) return;
    queueMicrotask(() => {
      menu.setPopupPaginationItem((paginationProps?: CourierInboxPaginationItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupPaginationItem!(paginationProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupPaginationItem, menuRef]);

  // Render menu button
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPopupMenuButton) return;
    queueMicrotask(() => {
      menu.setPopupMenuButton((buttonProps?: CourierInboxMenuButtonFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderPopupMenuButton!(buttonProps);
        return reactNodeToHTMLElement(reactNode);
      });
    });
  }, [props.renderPopupMenuButton, menuRef]);

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