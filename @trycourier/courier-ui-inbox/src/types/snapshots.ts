import { InboxMessage } from "@trycourier/courier-js";
import { InboxDataSet } from "./inbox-data-set";

export type MessageSnapshot = {
  message: InboxMessage;
  archiveIndex?: number;
  inboxIndex?: number;
};

export type DataSetSnapshot = {
  unreadCount: number;
  inbox: InboxDataSet;
  archive: InboxDataSet;
};
