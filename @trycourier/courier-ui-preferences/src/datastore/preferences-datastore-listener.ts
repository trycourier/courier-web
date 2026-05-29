import { CourierPreferencesDatastore } from "./preferences-datastore";
import { CourierPreferencesDatastoreEvents } from "./preferences-datastore-events";

/**
 * Listener for preferences datastore changes.
 * @public
 */
export class CourierPreferencesDatastoreListener {
  constructor(readonly events: CourierPreferencesDatastoreEvents) {}

  remove() {
    CourierPreferencesDatastore.shared.removeDatastoreListener(this);
  }
}
