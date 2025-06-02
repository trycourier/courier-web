import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";

export type InboxDataSet = {
  feedType: CourierInboxFeedType;
  messages: InboxMessage[];
  canPaginate: boolean;
  paginationCursor: string | null;
};
