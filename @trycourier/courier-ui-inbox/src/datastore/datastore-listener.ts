import { CourierInboxDatastore } from "./datastore";
import { CourierInboxDatastoreEvents } from "./datatore-events";

export class CourierInboxDataStoreListener {
  readonly events: CourierInboxDatastoreEvents;

  constructor(events: CourierInboxDatastoreEvents) {
    this.events = events;
  }

  remove() {
    CourierInboxDatastore.shared.removeDataStoreListener(this);
  }

}
