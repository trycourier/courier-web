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
 * Resolve a message's click tracking id.
 *
 * The two delivery paths disagree on where tracking ids live: the messages query returns them
 * on a top-level `trackingIds`, while the realtime socket payload only nests them under
 * `data.trackingIds`. Checking `data` first matches the iOS and Android SDKs, so a message
 * that arrived over the socket is still clickable.
 *
 * @param message - The message to read the click tracking id from
 * @returns The click tracking id, or undefined if the message has none
 */
export function getClickTrackingId(message: InboxMessage): string | undefined {
  const fromData = message.data?.['trackingIds']?.['clickTrackingId'];
  if (typeof fromData === 'string') {
    return fromData;
  }

  return message.trackingIds?.clickTrackingId;
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

/**
 * Compare the mutable fields of two InboxMessages.
 * @param message1 - The first inbox message to compare
 * @param message2 - The second inbox message to compare
 * @returns True if the mutable fields are equal, false otherwise
 */
export function mutableInboxMessageFieldsEqual(message1: InboxMessage, message2: InboxMessage): boolean {
  // Compare only mutable state fields
  if (message1.archived !== message2.archived) {
    return false;
  }
  if (message1.read !== message2.read) {
    return false;
  }
  if (message1.opened !== message2.opened) {
    return false;
  }

  return true;
}

export function getMessageTime(message: InboxMessage): string {
  if (!message.created) {
    return 'Now';
  }

  const now = new Date();
  const messageDate = new Date(message.created);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 5) {
    return 'Now';
  }
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h`;
  }
  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d`;
  }
  if (diffInSeconds < 31536000) {
    return `${Math.floor(diffInSeconds / 604800)}w`;
  }
  return `${Math.floor(diffInSeconds / 31536000)}y`;
}
