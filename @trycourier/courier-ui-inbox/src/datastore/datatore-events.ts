import { FeedType } from "../types/feed-type";
import { InboxDataSet } from "../types/inbox-data-set";
import { InboxMessage } from "@trycourier/courier-js";

export class CourierInboxDataStoreEvents {
  public onDataSetChange?(dataSet: InboxDataSet, feedType: FeedType): void { }
  public onPageAdded?(dataSet: InboxDataSet, feedType: FeedType): void { }
  public onUnreadCountChange?(unreadCount: number): void { }
  public onMessageAdd?(message: InboxMessage, index: number, feedType: FeedType): void { }
  public onMessageRemove?(message: InboxMessage, index: number, feedType: FeedType): void { }
  public onMessageUpdate?(message: InboxMessage, index: number, feedType: FeedType): void { }
}
