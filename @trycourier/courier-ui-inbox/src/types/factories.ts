import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeed } from "./inbox-data-set";

// Header
export type CourierInboxHeaderFactoryProps = {
  feeds: CourierInboxFeed[];
  activeFeedId: string;
  activeTabId: string;
  showTabs: boolean;
  unreadCount: number;
  messageCount: number;
}

// States
export type CourierInboxStateLoadingFactoryProps = {
  feedType: string;
}

export type CourierInboxStateEmptyFactoryProps = {
  feedType: string;
}

export type CourierInboxStateErrorFactoryProps = {
  feedType: string;
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
  feedType: string;
}

// Menu Button
export type CourierInboxMenuButtonFactoryProps = {
  unreadCount: number;
}
