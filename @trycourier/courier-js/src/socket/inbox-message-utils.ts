import { InboxMessage } from "../types/inbox";
import { InboxMessageEvent, InboxMessageEventEnvelope } from "../types/socket/protocol/v1/messages";

/**
 * Ensure the `created` timestamp is set for a new message.
 *
 * New messages received from the WebSocket may not have a created time,
 * until they are retrieved from the GraphQL API.
 *
 * @param envelope - The envelope containing the message event.
 * @returns The envelope with the created time set.
 */
function ensureCreatedTime(envelope: InboxMessageEventEnvelope): InboxMessageEventEnvelope {
  if (envelope.event === InboxMessageEvent.NewMessage) {
    const message = envelope.data as InboxMessage;

    if (!message.created) {
      message.created = new Date().toISOString();
    }

    return {
      ...envelope,
      data: message,
    };
  }

  return envelope;
}

/**
 * Apply fixes to a message event envelope.
 *
 * @param envelope - The envelope containing the message event.
 * @returns The envelope with the fixes applied.
 */
export function fixMessageEventEnvelope(envelope: InboxMessageEventEnvelope): InboxMessageEventEnvelope {
  // Apply any fixes to the message event envelope.
  return ensureCreatedTime(envelope);
}
