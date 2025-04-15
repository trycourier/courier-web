import { CourierInboxDatastore } from "./datastore";
import { CourierInboxDataStoreEvents } from "./datatore-events";

export class CourierInboxDataStoreListener {
  readonly events: CourierInboxDataStoreEvents;

  constructor(events: CourierInboxDataStoreEvents) {
    this.events = events;
  }

  remove() {
    CourierInboxDatastore.shared.removeDataStoreListener(this);
  }

}
