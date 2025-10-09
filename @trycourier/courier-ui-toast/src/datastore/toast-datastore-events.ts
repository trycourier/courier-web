import { InboxMessage } from "@trycourier/courier-js";

/**
 * The set of {@link CourierToastDatastore} events for which listeners can be added.
 *
 * @public
 */
export class CourierToastDatastoreEvents {
  public onMessageAdd?(_: InboxMessage): void { }
  public onMessageRemove?(_: InboxMessage): void { }
  public onError?(_: Error): void { }
}
