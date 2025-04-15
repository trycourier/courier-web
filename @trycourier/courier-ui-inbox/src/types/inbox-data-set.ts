import { InboxMessage } from "@trycourier/courier-js";

export type InboxDataSet = {
  messages: InboxMessage[];
  canPaginate: boolean;
  paginationCursor: string | null;
};
