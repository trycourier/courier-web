import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxFeedType } from "./feed-type";

export type InboxDataSet = {
  feedType: CourierInboxFeedType;
  messages: InboxMessage[];
  canPaginate: boolean;
  paginationCursor: string | null;
};

/**
 * Filter options for the unread and archived filters on a dataset.
 */
export type CourierInboxDatasetMessageState = 'archived' | 'unarchived' | 'read' | 'unread';

export type CourierInboxDatasetFilter = {
  /**
   * The set of tags to match to a message's tags. If a message has any of the tags,
   * the message will be included in the dataset.
   */
  tags?: string[];

  /**
   * The set of states to match to a message's states.
   *
   * Omitting the states filter will include all messages.
   * An empty list of states will exclude all messages.
   * Multiple states given will include the union of matching messages, for example
   * if `states` is `['archived', 'read']`, the dataset will include both ar
   */
  archivedStates?: CourierInboxDatasetMessageState[];
}
