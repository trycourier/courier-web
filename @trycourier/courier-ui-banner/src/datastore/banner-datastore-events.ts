import { InboxMessage } from "@trycourier/courier-js";

/**
 * The set of {@link CourierBannerDatastore} events for which listeners can be added.
 *
 * @public
 */
export class CourierBannerDatastoreEvents {
  public onMessageAdd?(_: InboxMessage): void { }
  public onMessageRemove?(_: InboxMessage): void { }
  public onError?(_: Error): void { }
}
