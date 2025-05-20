import { useMemo, useRef, useEffect } from "react";
import { CourierInboxFeedType, CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenu as CourierInboxMenuElement, CourierInboxPaginationItemFactoryProps, CourierInboxPopupAlignment, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxTheme } from "@trycourier/courier-ui-inbox";
import { serializeHandler } from "../utils/utils";
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
  renderHeader?: (props: CourierInboxHeaderFactoryProps | undefined | null) => React.ReactNode;
  renderListItem?: (props: CourierInboxListItemFactoryProps | undefined | null) => React.ReactNode;
  renderEmptyState?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => React.ReactNode;
  renderLoadingState?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => React.ReactNode;
  renderErrorState?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => React.ReactNode;
  renderPaginationItem?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => React.ReactNode;
}

export const CourierInboxMenu = (props: CourierInboxMenuProps) => {
  const menuRef = useRef<CourierInboxMenuElement>(null);

  // Serialized handlers
  // This is necessary because the web component expects a string, not a function
  const clickAttr = useMemo(() => serializeHandler(props.onMessageClick), [props.onMessageClick]);
  const actionClickAttr = useMemo(() => serializeHandler(props.onMessageActionClick), [props.onMessageActionClick]);
  const longPressAttr = useMemo(() => serializeHandler(props.onMessageLongPress), [props.onMessageLongPress]);

  // Render header
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderHeader) return;
    // queueMicrotask(() => {
    //   menu.setHeader((headerProps?: CourierInboxHeaderFactoryProps | undefined | null): HTMLElement => {
    //     const reactNode = props.renderHeader!(headerProps);
    //     return reactNodeToHTMLElement(reactNode);
    //   });
    // });
  }, [props.renderHeader, menuRef]);

  // Render list item
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderListItem) return;
    // queueMicrotask(() => {
    //   menu.setListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
    //     const reactNode = props.renderListItem!(itemProps);
    //     return reactNodeToHTMLElement(reactNode);
    //   });
    // });
  }, [props.renderListItem, menuRef]);

  // Render empty state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderEmptyState) return;
    // queueMicrotask(() => {
    //   menu.setEmptyState((emptyStateProps?: CourierInboxStateEmptyFactoryProps | undefined | null): HTMLElement => {
    //     const reactNode = props.renderEmptyState!(emptyStateProps);
    //     return reactNodeToHTMLElement(reactNode);
    //   });
    // });
  }, [props.renderEmptyState, menuRef]);

  // Render loading state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderLoadingState) return;
    // queueMicrotask(() => {
    //   menu.setLoadingState((loadingStateProps?: CourierInboxStateLoadingFactoryProps | undefined | null): HTMLElement => {
    //     const reactNode = props.renderLoadingState!(loadingStateProps);
    //     return reactNodeToHTMLElement(reactNode);
    //   });
    // });
  }, [props.renderLoadingState, menuRef]);

  // Render error state
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderErrorState) return;
    // queueMicrotask(() => {
    //   menu.setErrorState((errorStateProps?: CourierInboxStateErrorFactoryProps | undefined | null): HTMLElement => {
    //     const reactNode = props.renderErrorState!(errorStateProps);
    //     return reactNodeToHTMLElement(reactNode);
    //   });
    // });
  }, [props.renderErrorState, menuRef]);

  // Render pagination item
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !props.renderPaginationItem) return;
    // queueMicrotask(() => {
    //   menu.setPaginationItem((paginationProps?: CourierInboxPaginationItemFactoryProps | undefined | null): HTMLElement => {
    //     const reactNode = props.renderPaginationItem!(paginationProps);
    //     return reactNodeToHTMLElement(reactNode);
    //   });
    // });
  }, [props.renderPaginationItem, menuRef]);

  // Set feed type
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    // queueMicrotask(() => {
    //   menu.setFeedType(props.feedType || 'inbox');
    // });
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
      message-click={clickAttr}
      message-action-click={actionClickAttr}
      message-long-press={longPressAttr}
      light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
      dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
      mode={props.mode}
    />
  );
};

