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
   * Called when the dataset changes.
   * @public
   * @param _dataset - The updated inbox dataset
   */
  public onDataSetChange?(_dataset: InboxDataSet): void { }

  /**
   * Called when a new page is added to the dataset.
   * @public
   * @param _dataset - The updated inbox dataset with the new page
   */
  public onPageAdded?(_dataset: InboxDataSet): void { }

  /**
   * Called when the unread count changes.
   * @public
   * @param _unreadCount - The new unread count
   * @param _datasetId - The dataset ID that was updated
   */
  public onUnreadCountChange?(_unreadCount: number, _datasetId: string): void { }

  /**
   * Called when the total unread count across all datasets changes.
   * @public
   * @param _totalUnreadCount - The new total unread count
   */
  public onTotalUnreadCountChange?(_totalUnreadCount: number): void { }

  /**
   * Called when a new message is added.
   * @public
   * @param _message - The added InboxMessage
   * @param _index - The index where the message was added
   * @param _datasetId - The dataset ID that was updated
   */
  public onMessageAdd?(_message: InboxMessage, _index: number, _datasetId: string): void { }

  /**
   * Called when a message is removed.
   * @public
   * @param _message - The InboxMessage that was removed
   * @param _index - The index from which the message was removed
   * @param _datasetId - The dataset ID that was updated
   */
  public onMessageRemove?(_message: InboxMessage, _index: number, _datasetId: string): void { }

  /**
   * Called when a message is updated.
   * @public
   * @param _message - The updated InboxMessage
   * @param _index - The index where the message was updated
   * @param _datasetId - The dataset ID that was updated
   */
  public onMessageUpdate?(_message: InboxMessage, _index: number, _datasetId: string): void { }

  /**
   * Called when an error occurs in the data store.
   * @public
   * @param _error - The error object
   */
  public onError?(_error: Error): void { }
}
