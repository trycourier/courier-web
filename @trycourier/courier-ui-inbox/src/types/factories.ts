import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatasetFilter } from "./inbox-data-set";

// Header
export type CourierInboxHeaderFactoryProps = {
  feeds: CourierInboxHeaderFeed[];
}

export type CourierInboxHeaderFeed = {
  id: string;
  title: string;
  iconSVG?: string;
  tabs: CourierInboxHeaderFeedTab[];
  isSelected: boolean;
}

export type CourierInboxHeaderFeedTab = {
  id: string;
  title: string;
  unreadCount: number;
  isSelected: boolean;
  filter: CourierInboxDatasetFilter;
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
