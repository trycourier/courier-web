import { InboxAction, InboxMessage } from "@trycourier/courier-js";
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

/**
 * Report a click on a message action.
 *
 * The inbox and toast components already do this for you when an action is pressed; this is for
 * a custom list item that renders its own buttons. A no-op when the action carries no tracking
 * id, which is what a template that opted out of tracking delivers.
 */
export function markActionAsClicked(action: InboxAction, messageId: string): Promise<void> {
  return CourierInboxDatastore.shared.clickMessageAction({ messageId, action });
}

export function archiveMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.archiveMessage({ message });
}

export function openMessage(message: InboxMessage): void {
  CourierInboxDatastore.shared.openMessage({ message });
}
