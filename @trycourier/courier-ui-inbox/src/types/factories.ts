import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";

// Header
export type CourierInboxHeaderFactoryProps = {
  feedType: CourierInboxFeedType | string;
  unreadCount: number;
  messageCount: number;
}

// States
export type CourierInboxStateLoadingFactoryProps = {
  feedType: CourierInboxFeedType | string;
}

export type CourierInboxStateEmptyFactoryProps = {
  feedType: CourierInboxFeedType | string;
}

export type CourierInboxStateErrorFactoryProps = {
  feedType: CourierInboxFeedType | string;
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
  feedType: CourierInboxFeedType | string;
}

// Menu Button
export type CourierInboxMenuButtonFactoryProps = {
  unreadCount: number;
}
