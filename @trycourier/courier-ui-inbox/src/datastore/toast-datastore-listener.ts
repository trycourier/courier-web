import { CourierToastDatastore } from "./toast-datastore";
import { CourierToastDatastoreEvents } from "./toast-datastore-events";

export class CourierToastDatastoreListener {
  constructor(readonly events: CourierToastDatastoreEvents) {}

  remove() {
    CourierToastDatastore.shared.removeDatastoreListener(this);
  }
}
