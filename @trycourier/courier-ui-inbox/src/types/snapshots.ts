import { InboxMessage } from "@trycourier/courier-js";
import { InboxDataSet } from "./inbox-data-set";

/**
 * @deprecated - this type has been superceded by the snapshot interface in inbox-datastore.ts
 */
export type MessageSnapshot = {
  message: InboxMessage;
  archiveIndex?: number;
  inboxIndex?: number;
};

/**
 * @deprecated - this type has been superceded by the snapshot interface in inbox-datastore.ts
 */
export type DataSetSnapshot = {
  unreadCount: number;
  inbox?: InboxDataSet;
  archive?: InboxDataSet;
};
