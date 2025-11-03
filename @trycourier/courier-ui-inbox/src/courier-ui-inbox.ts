import { CourierInboxDatastore } from "./datastore/datastore";

export class CourierUIInbox {
  private static instance: CourierUIInbox;

  public datastore: CourierInboxDatastore = CourierInboxDatastore.shared;


  public static get shared(): CourierUIInbox {
    if (!CourierUIInbox.instance) {
      CourierUIInbox.instance = new CourierUIInbox();
    }
    return CourierUIInbox.instance;
  }

}
