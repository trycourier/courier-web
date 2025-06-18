import { InboxMessage } from "../../inbox";

/** Client actions. */
export enum ClientAction {
  /** Subscribe to various events for a particular channel. */
  Subscribe = 'subscribe',

  /** Unsubscribe from a channel. */
  Unsubscribe = 'unsubscribe',

  /** Pong response to a ping message from the server. */
  Pong = 'pong',

  /** Ping the server to keep the connection alive. */
  Ping = 'ping',

  /** Get the current configuration. */
  GetConfig = 'get-config',
}

/** Client request envelope. */
export interface ClientMessageEnvelope {
  /**
   * Transaction ID.
   *
   * This is a UUID generated per-socket message.
   *
   * The server response should include the same transaction ID.
   */
  tid: string;

  /** Requested action for the server to perform. */
  action: ClientAction;

  /** Optional: Statistics describing past requests and/or client state. */
  stats?: Record<string, any>;

  /** Optional: Payload for the request, varying by action. */
  data?: Record<string, any>;
}

export enum ServerAction {
  /** Ping message from the server. */
  Ping = 'ping',
}

/**
 * Server action envelope.
 *
 * This is a request for the client to perform an action and respond to the server.
 */
export interface ServerActionEnvelope {
  /** Transaction ID. */
  tid: string;

  /** Action from the server. */
  action: ServerAction;
}

/** Server response types. */
export enum ServerResponse {
  /** Response to an action request. */
  Ack = 'ack',

  /** Response to a ping request. */
  Pong = 'pong',
}

/**
 * Server response envelope.
 *
 * This is a response from the server to a {@link ClientAction} (ping, subscribe, get-config, etc.).
 */
export interface ServerResponseEnvelope {
  /** Transaction ID. */
  tid: string;

  /** Response from the server. */
  response: ServerResponse;

  /** Optional: Payload for the response, varying by response. */
  data?: Record<string, any>;
}

/** Message event types broadcast by the server. */
export enum InboxMessageEvent {
  NewMessage = 'message',
  Archive = 'archive',
  ArchiveAll = 'archive-all',
  ArchiveRead = 'archive-read',
  Clicked = 'clicked',
  MarkAllRead = 'mark-all-read',
  Opened = 'opened',
  Read = 'read',
  Unarchive = 'unarchive',
  Unopened = 'unopened',
  Unread = 'unread',
}

/** Envelope for an inbox message event. */
export interface InboxMessageEventEnvelope {
  /** Event type indicating a new message, or a mutation to one or more existing messages. */
  event: InboxMessageEvent;

  /** Message ID. */
  messageId?: string;

  /** Optional: Message data, varying by event. */
  data?: InboxMessage;
}

/** Message sent by the server to indicate that the client should reconnect. */
export interface ReconnectMessage {
  /** Event type indicating a reconnection. */
  event: 'reconnect';

  /** Message describing the reason for the reconnection. */
  message: string;

  /** Seconds after which the client should retry the connection. */
  retryAfter: number;

  /** https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code */
  code: number;
}

/** Configuration for the client. */
export interface Config {
  /** The time interval in milliseconds between client ping messages to the server. */
  pingInterval: number;

  /**
   * Maximum number of outstanding pings before the client should
   * close the connection and retry connecting.
   */
  maxOutstandingPings: number;
}

/** Envelope for a config response. */
export interface ConfigResponseEnvelope {
  /** Transaction ID. */
  tid: string;

  response: 'config';

  /** Configuration data for the client. */
  data: Config;
}

export type ServerMessage =
  | ConfigResponseEnvelope
  | InboxMessageEventEnvelope
  | ReconnectMessage
  | ServerActionEnvelope
  | ServerResponseEnvelope;
