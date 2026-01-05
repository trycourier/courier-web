import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatasetFilter } from "./inbox-data-set";

// Header
export type CourierInboxHeaderFactoryProps = {
  feeds: CourierInboxHeaderFeed[];
}

export type CourierInboxHeaderFeed = {
  feedId: string;
  title: string;
  iconSVG?: string;
  tabs: CourierInboxHeaderFeedTab[];
  isSelected: boolean;
}

export type CourierInboxHeaderFeedTab = {
  datasetId: string;
  title: string;
  unreadCount: number;
  isSelected: boolean;
  filter: CourierInboxDatasetFilter;
}

// States
export type CourierInboxStateLoadingFactoryProps = {
  datasetId: string;
}

export type CourierInboxStateEmptyFactoryProps = {
  datasetId: string;
}

export type CourierInboxStateErrorFactoryProps = {
  datasetId: string;
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
  datasetId: string;
}

// Menu Button
export type CourierInboxMenuButtonFactoryProps = {
  totalUnreadCount: number;
  feeds: CourierInboxHeaderFeed[];
}
