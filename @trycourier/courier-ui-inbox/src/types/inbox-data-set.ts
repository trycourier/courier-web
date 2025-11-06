import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";

export type InboxDataSet = {
  feedType: CourierInboxFeedType;
  messages: InboxMessage[];
  canPaginate: boolean;
  paginationCursor: string | null;
};

export type CourierInboxDatasetFilter = {
  /**
   * The set of tags to match to a message's tags. If a message has any of the tags,
   * the message will be included in the dataset.
   */
  tags?: string[];

  /** Whether to include archived messages. Defaults to false if unset. */
  archived?: boolean;

  /* Whether to limit messages to those that are read or unread. Undefined applies no state filter. */
  status?: 'read' | 'unread';
}
