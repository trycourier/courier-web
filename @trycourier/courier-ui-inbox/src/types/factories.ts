import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";

// Header
export type CourierInboxHeaderFactoryProps = {
  feedType: CourierInboxFeedType;
  unreadCount: number;
  messageCount: number;
}

export type CourierInboxHeaderFactory = (props: CourierInboxHeaderFactoryProps) => HTMLElement;

// States
export type CourierInboxStateLoadingFactoryProps = {
  feedType: CourierInboxFeedType;
}

export type CourierInboxStateEmptyFactoryProps = {
  feedType: CourierInboxFeedType;
}

export type CourierInboxStateErrorFactoryProps = {
  feedType: CourierInboxFeedType;
  error: Error;
}

export type CourierInboxLoadingStateFactory = (props: CourierInboxStateLoadingFactoryProps) => HTMLElement;
export type CourierInboxEmptyStateFactory = (props: CourierInboxStateEmptyFactoryProps) => HTMLElement;
export type CourierInboxErrorStateFactory = (props: CourierInboxStateErrorFactoryProps) => HTMLElement;

// List Item
export type CourierInboxListItemFactoryProps = {
  message: InboxMessage;
  index: number;
}

export type CourierInboxListItemFactory = (props: CourierInboxListItemFactoryProps) => HTMLElement;

// Pagination Item
export type CourierInboxPaginationItemFactoryProps = {
  feedType: CourierInboxFeedType;
}

export type CourierInboxPaginationItemFactory = (props: CourierInboxPaginationItemFactoryProps) => HTMLElement;
