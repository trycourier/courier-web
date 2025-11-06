import { CourierInboxFeedType } from "../types/feed-type";
import { InboxDataSet } from "../types/inbox-data-set";
import { InboxMessage } from "@trycourier/courier-js";

export class CourierInboxDatastoreEvents {
  /**
   * @public
   */
  public onDataSetChange?(_: InboxDataSet, __: CourierInboxFeedType | string): void { }
  /**
   * @public
   */
  public onPageAdded?(_: InboxDataSet, __: CourierInboxFeedType | string): void { }
  /**
   * @public
   */
  public onUnreadCountChange?(_: number): void { }
  /**
   * @public
   */
  public onMessageAdd?(_: InboxMessage, __: number, ___: CourierInboxFeedType | string): void { }
  /**
   * @public
   */
  public onMessageRemove?(_: InboxMessage, __: number, ___: CourierInboxFeedType | string): void { }
  /**
   * @public
   */
  public onMessageUpdate?(_: InboxMessage, __: number, ___: CourierInboxFeedType | string): void { }
  /**
   * @public
   */
  public onError?(_: Error): void { }
}
