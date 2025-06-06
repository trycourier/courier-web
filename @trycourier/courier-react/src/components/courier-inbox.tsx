import React, { useRef, useEffect } from "react";
import { CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxTheme, CourierInbox as CourierInboxElement, CourierInboxHeaderFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateLoadingFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxFeedType } from "@trycourier/courier-ui-inbox";
import { reactNodeToHTMLElement } from "../utils/utils";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";

export interface CourierInboxProps {
  height?: string;
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

export const CourierInbox = (props: CourierInboxProps) => {
  const inboxRef = useRef<CourierInboxElement>(null);

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
};