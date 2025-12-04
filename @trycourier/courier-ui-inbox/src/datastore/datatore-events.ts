import { InboxDataSet } from "../types/inbox-data-set";
import { InboxMessage } from "@trycourier/courier-js";

/**
 * Event callbacks which may be fully or partially implemented to be called when
 * {@link CourierInboxDatastore} has updates.
 *
 * @public
 */
export class CourierInboxDatastoreEvents {
  /**
   * @public
   */
  public onDataSetChange?(_: InboxDataSet, __: string): void { }
  /**
   * @public
   */
  public onPageAdded?(_: InboxDataSet, __: string): void { }
  /**
   * @public
   * @param _ - the new unread count
   * @param __ - the dataset ID that was updated
   */
  public onUnreadCountChange?(_: number, __: string): void { }
  /**
   * @public
   */
  public onMessageAdd?(_: InboxMessage, __: number, ___: string): void { }
  /**
   * @public
   */
  public onMessageRemove?(_: InboxMessage, __: number, ___: string): void { }
  /**
   * @public
   */
  public onMessageUpdate?(_: InboxMessage, __: number, ___: string): void { }
  /**
   * @public
   */
  public onError?(_: Error): void { }
}
