import { InboxMessage } from "../../../inbox";

/**
 * Client actions.
 */
export enum ClientAction {
  /** Subscribe to various events for a particular channel. */
  Subscribe = 'subscribe',

  /** Unsubscribe from a channel. */
  Unsubscribe = 'unsubscribe',

  /** Ping the server to keep the connection alive. */
  Ping = 'ping',
}

/**
 * Client request envelope.
 */
export interface ActionRequestEnvelope {
  /**
   * Transaction ID.
   *
   * This is a UUID generated per-socket message.
   *
   * The server response should include the same transaction ID.
   */
  tid: string;

  /**
   * Requested action for the server to perform.
   */
  action: ClientAction;

  /**
   * Optional: Statistics describing past requests and/or client state.
   */
  stats?: Record<string, any>;

  /**
   * Optional: Payload for the request, varying by action.
   */
  data?: Record<string, any>;
}

export enum ActionResponse {
  /** Response to an action request. */
  Ack = 'ack',

  /** Response to a ping request. */
  Pong = 'pong',
}

/**
 * Server response envelope.
 */
export interface ActionResponseEnvelope {
  /**
   * Transaction ID.
   *
   * The client request should include the same transaction ID.
   */
  tid: string;

  /**
   * Response from the server.
   */
  response: ActionResponse;
}

/**
 * Message event types broadcast by the server.
 */
export enum MessageEvent {
  NewMessage = 'message',
  Archive = 'archive',
  ArchiveRead = 'archive-read',
  Clicked = 'clicked',
  MarkAllRead = 'mark-all-read',
  Opened = 'opened',
  Read = 'read',
  Unarchive = 'unarchive',
  Unopened = 'unopened',
  Unread = 'unread',
}

/**
 * Envelope for a message event.
 */
export interface MessageEventEnvelope {
  /** Transaction ID. */
  tid: string;

  /** Event type indicating a new message, or a mutation to one or more existing messages. */
  event: MessageEvent;

  /** Optional: Message data, varying by event. */
  data?: InboxMessage;
}
