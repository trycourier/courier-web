import { CourierInboxDatastore } from "./courier-inbox-datastore";
import { CourierInboxDataStoreEvents } from "./courier-inbox-datatore-events";

export class CourierInboxDataStoreListener {
  readonly events: CourierInboxDataStoreEvents;

  constructor(events: CourierInboxDataStoreEvents) {
    this.events = events;
  }

  remove() {
    CourierInboxDatastore.shared.removeDataStoreListener(this);
  }

}
