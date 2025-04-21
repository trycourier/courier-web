import { CourierInboxFeedType } from "./feed-type";

// Header
export type CourierInboxHeaderFactoryProps = {
  feedType: CourierInboxFeedType;
  unreadCount: number;
  messageCount: number;
}

export type CourierInboxHeaderFactory = (props: CourierInboxHeaderFactoryProps) => HTMLElement;

// States
export type CourierInboxStateFactoryProps = {
  feedType: CourierInboxFeedType;
}

export type CourierInboxStateErrorFactoryProps = {
  feedType: CourierInboxFeedType;
  error: Error;
}

export type CourierInboxLoadingStateFactory = (props: CourierInboxStateFactoryProps) => HTMLElement;
export type CourierInboxEmptyStateFactory = (props: CourierInboxStateFactoryProps) => HTMLElement;
export type CourierInboxErrorStateFactory = (props: CourierInboxStateErrorFactoryProps) => HTMLElement;