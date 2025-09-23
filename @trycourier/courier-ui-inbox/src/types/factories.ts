import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";
import { CourierToastItem } from "../components/courier-toast-item";

// Header
export type CourierInboxHeaderFactoryProps = {
  feedType: CourierInboxFeedType;
  unreadCount: number;
  messageCount: number;
}

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

// List Item
export type CourierInboxListItemFactoryProps = {
  message: InboxMessage;
  index: number;
}

// List Item Action
export type CourierInboxListItemActionFactoryProps = {
  message: InboxMessage;
  action: InboxAction;
  index: number;
}

// Pagination Item
export type CourierInboxPaginationItemFactoryProps = {
  feedType: CourierInboxFeedType;
}

// Menu Button
export type CourierInboxMenuButtonFactoryProps = {
  unreadCount: number;
}

// Toast Item
export type CourierToastItemFactoryProps = {
  message: InboxMessage;
}

// Toast Item Event Props
export type CourierToastItemAddedEvent = {
  message: InboxMessage;
  toastItem: CourierToastItem | HTMLElement;
}

export type CourierToastItemClickedEvent = {
  message: InboxMessage;
  toastItem: CourierToastItem;
}

export type CourierToastItemDismissedEvent = {
  message: InboxMessage;
}
