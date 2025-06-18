import { InboxMessage, InboxAction } from "@trycourier/courier-js";
import { InboxDataSet } from "../types/inbox-data-set";

/**
 * Copy a message
 * @param message - The message to copy
 * @returns A copy of the message
 */
export function copyMessage(message: InboxMessage): InboxMessage {
  const copy = {
    ...message,
  };

  if (message.actions) {
    copy.actions = message.actions.map(action => copyInboxAction(action));
  }

  if (message.data) {
    copy.data = JSON.parse(JSON.stringify(message.data));
  }

  if (message.tags) {
    copy.tags = [...message.tags];
  }

  if (message.trackingIds) {
    copy.trackingIds = { ...message.trackingIds };
  }

  return copy;
}

/**
 * Copy an inbox action
 * @param action - The inbox action to copy
 * @returns A copy of the inbox action
 */
export function copyInboxAction(action: InboxAction): InboxAction {
  const copy = {
    ...action,
  };

  if (action.data) {
    copy.data = JSON.parse(JSON.stringify(action.data));
  }

  return copy;
}

/**
 * Copy an inbox data set
 * @param dataSet - The inbox data set to copy
 * @returns A copy of the inbox data set
 */
export function copyInboxDataSet(dataSet?: InboxDataSet): InboxDataSet | undefined {

  if (!dataSet) {
    return undefined;
  }

  return {
    ...dataSet,
    messages: dataSet.messages.map(message => copyMessage(message)),
  };

}

export function getMessageTime(message: InboxMessage): string {
  if (!message.created) return 'Now';

  const now = new Date();
  const messageDate = new Date(message.created);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 5) return 'Now';
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 604800)}w`;
  return `${Math.floor(diffInSeconds / 31536000)}y`;
}