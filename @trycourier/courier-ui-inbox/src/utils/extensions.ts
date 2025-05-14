import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxDatastore } from "../datastore/datastore";

export function markAsRead(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.readMessage(message);
}

export function markAsUnread(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.unreadMessage(message);
}

export function clickMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.clickMessage(message);
}

export function archiveMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.archiveMessage(message);
}

export function openMessage(message: InboxMessage): Promise<void> {
  return CourierInboxDatastore.shared.openMessage(message);
}

export function getMessageTime(message: InboxMessage): string {
  if (!message.created) return 'Now';

  const now = new Date();
  const messageDate = new Date(message.created);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 604800)}w`;
  return `${Math.floor(diffInSeconds / 31536000)}y`;
}
