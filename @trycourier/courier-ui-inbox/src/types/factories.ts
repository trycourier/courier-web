import { FeedType } from "./feed-type";

export type CourierInboxHeaderFactoryProps = {
  feedType: FeedType;
  unreadCount: number;
  messageCount: number;
}

export type CourierInboxHeaderFactory = (props: CourierInboxHeaderFactoryProps) => HTMLElement;