import { CourierInboxFeedType } from "../types/feed-type";
import { InboxDataSet } from "../types/inbox-data-set";
import { InboxMessage } from "@trycourier/courier-js";

export class CourierInboxDatastoreEvents {
  public onDataSetChange?(_: InboxDataSet, __: CourierInboxFeedType): void { }
  public onPageAdded?(_: InboxDataSet, __: CourierInboxFeedType): void { }
  public onUnreadCountChange?(_: number): void { }
  public onMessageAdd?(_: InboxMessage, __: number, ___: CourierInboxFeedType): void { }
  public onMessageRemove?(_: InboxMessage, __: number, ___: CourierInboxFeedType): void { }
  public onMessageUpdate?(_: InboxMessage, __: number, ___: CourierInboxFeedType): void { }
  public onError?(_: Error): void { }
}
