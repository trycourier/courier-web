import { CourierBannerDatastore } from "./banner-datastore";
import { CourierBannerDatastoreEvents } from "./banner-datastore-events";

/**
 * Listener containing callbacks for {@link CourierBannerDatastore} events.
 *
 * @public
 */
export class CourierBannerDatastoreListener {
  constructor(readonly events: CourierBannerDatastoreEvents) {}

  /** Remove this listener. Callbacks will no longer be invoked after remove is called. */
  remove() {
    CourierBannerDatastore.shared.removeDatastoreListener(this);
  }
}
