import { CourierInboxFeedType } from "../types/feed-type";
import { InboxDataSet } from "../types/inbox-data-set";
import { InboxMessage } from "@trycourier/courier-js";

export class CourierInboxDataStoreEvents {
  public onDataSetChange?(dataSet: InboxDataSet, feedType: CourierInboxFeedType): void { }
  public onPageAdded?(dataSet: InboxDataSet, feedType: CourierInboxFeedType): void { }
  public onUnreadCountChange?(unreadCount: number): void { }
  public onMessageAdd?(message: InboxMessage, index: number, feedType: CourierInboxFeedType): void { }
  public onMessageRemove?(message: InboxMessage, index: number, feedType: CourierInboxFeedType): void { }
  public onMessageUpdate?(message: InboxMessage, index: number, feedType: CourierInboxFeedType): void { }
  public onError?(error: Error): void { }
}
