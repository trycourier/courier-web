import { CourierToastDatastore } from "./toast-datastore";
import { CourierToastDatastoreEvents } from "./toast-datastore-events";

/**
 * Listener containing callbacks for {@link CourierToastDatastore} events.
 *
 * @public
 */
export class CourierToastDatastoreListener {
  constructor(readonly events: CourierToastDatastoreEvents) {}

  /** Remove this listener. Callbacks will no longer be invoked after remove is called. */
  remove() {
    CourierToastDatastore.shared.removeDatastoreListener(this);
  }
}
