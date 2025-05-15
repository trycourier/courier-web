import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";

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
