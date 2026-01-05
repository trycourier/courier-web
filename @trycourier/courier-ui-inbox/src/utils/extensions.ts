import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";

export function markAsRead(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.readMessage({ message });
}

export function markAsUnread(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.unreadMessage({ message });
}

export function clickMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.clickMessage({ message });
}

export function archiveMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.archiveMessage({ message });
}

export function openMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.openMessage({ message });
}
