import { InboxMessage } from "@trycourier/courier-js";

export class CourierToastDatastoreEvents {
  public onMessageAdd?(_: InboxMessage): void { }
  public onMessageRemove?(_: InboxMessage): void { }
  public onError?(_: Error): void { }
}
