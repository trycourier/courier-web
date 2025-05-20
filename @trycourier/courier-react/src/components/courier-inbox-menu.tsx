import { useRef, useEffect } from "react";
import { CourierInboxFeedType, CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxMenu as CourierInboxMenuElement, CourierInboxPaginationItemFactoryProps, CourierInboxPopupAlignment, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxTheme } from "@trycourier/courier-ui-inbox";
import { reactNodeToHTMLElement } from "../utils/utils";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";

export interface CourierInboxMenuProps {
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
  renderPopupHeader?: (props: CourierInboxHeaderFactoryProps | undefined | null) => React.ReactNode;
  renderPopupListItem?: (props: CourierInboxListItemFactoryProps | undefined | null) => React.ReactNode;
  renderPopupEmptyState?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => React.ReactNode;
  renderPopupLoadingState?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => React.ReactNode;
  renderPopupErrorState?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => React.ReactNode;
  renderPopupPaginationItem?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => React.ReactNode;
  renderPopupMenuButton?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => React.ReactNode;
}

export const CourierInboxMenu = (props: CourierInboxMenuProps) => {
  const menuRef = useRef<CourierInboxMenuElement>(null);

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
    <courier-inbox-menu
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
  );
};
