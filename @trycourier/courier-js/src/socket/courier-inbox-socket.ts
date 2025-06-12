import { CourierClientOptions } from '../client/courier-client';
import { ClientAction, ClientMessageEnvelope, Config, ConfigResponseEnvelope, InboxMessageEvent, InboxMessageEventEnvelope, ServerAction, ServerActionEnvelope, ServerMessage, ServerResponseEnvelope } from '../types/socket/protocol/v1/messages';
import { UUID } from '../utils/uuid';
import { CourierSocket } from './courier-socket';
import { TransactionManager } from './courier-inbox-transaction-manager';
import { CLOSE_CODE_NORMAL_CLOSURE } from '../types/socket/protocol/v1/errors';
import { fixMessageEventEnvelope } from './inbox-message-utils';

/** Application-layer implementation of the Courier WebSocket API for Inbox messages. */
export class CourierInboxSocket extends CourierSocket {
  /**
   * The default interval in milliseconds at which to send a ping message to the server
   * if no other message has been received from the server.
   *
   * Fallback when the server does not provide a config.
   */
  private static readonly DEFAULT_PING_INTERVAL_MILLIS = 60_000; // 1 minute

  /**
   * The default maximum number of outstanding pings before the client should
   * close the connection and retry connecting.
   *
   * Fallback when the server does not provide a config.
   */
  private static readonly DEFAULT_MAX_OUTSTANDING_PINGS = 3;

  /**
   * The interval ID for the ping interval.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
   */
  private pingIntervalId: number | null = null;

  /**
   * The list of message event listeners, called when a message event is received
   * from the Courier WebSocket server.
   */
  private messageEventListeners: ((message: InboxMessageEventEnvelope) => void)[] = [];

  /** Server-provided configuration for the client. */
  private config: Config | null = null;

  /**
   * The transaction manager, used to track outstanding requests and responses.
   */
  private readonly pingTransactionManager: TransactionManager = new TransactionManager();

  constructor(options: CourierClientOptions) {
    super(options);
  }

  public onOpen(_: Event): Promise<void> {
    // Clear any outstanding pings from the previous connection before starting to ping.
    this.pingTransactionManager.clearOutstandingRequests();
    this.restartPingInterval();

    // Send a request for the client's configuration.
    this.sendGetConfig();

    return Promise.resolve();
  }

  public onMessageReceived(data: ServerMessage): Promise<void> {
    // ServerActionEnvelope
    // Respond to pings.
    if ('action' in data && data.action === ServerAction.Ping) {
      const envelope: ServerActionEnvelope = data as ServerActionEnvelope;
      this.sendPong(envelope);
    }

    // ServerResponseEnvelope
    // Track pongs.
    if ('response' in data && data.response === 'pong') {
      const envelope: ServerResponseEnvelope = data as ServerResponseEnvelope;

      // Keep track of the pong response and clear out any outstanding pings.
      // We only need to keep track of the most recent missed pings.
      this.pingTransactionManager.addResponse(envelope.tid, envelope);
      this.pingTransactionManager.clearOutstandingRequests();
    }

    // ConfigResponseEnvelope
    // Update the client's config.
    if ('response' in data && data.response === 'config') {
      const envelope: ConfigResponseEnvelope = data as ConfigResponseEnvelope;
      this.setConfig(envelope.data);
    }

    // InboxMessageEventEnvelope
    // Handle message events, calling all registered listeners.
    if ('event' in data && CourierInboxSocket.isInboxMessageEvent(data.event)) {
      const envelope: InboxMessageEventEnvelope = data as InboxMessageEventEnvelope;
      const fixedEnvelope = fixMessageEventEnvelope(envelope);
      for (const listener of this.messageEventListeners) {
        listener(fixedEnvelope);
      }
    }

    // Restart the ping interval if a message is received from the server.
    this.restartPingInterval();

    return Promise.resolve();
  }

  public onClose(_: CloseEvent): Promise<void> {
    return Promise.resolve();
  }
  public onError(_: Event): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Sends a subscribe message to the server.
   *
   * Subscribes to all events for the user.
   */
  public sendSubscribe(): void {
    const envelope: ClientMessageEnvelope = {
      tid: UUID.nanoid(),
      action: ClientAction.Subscribe,
      data: {
        channel: this.userId,
        event: '*'
      },
    };

    this.send(envelope);
  }

  /**
   * Sends an unsubscribe message to the server.
   *
   * Unsubscribes from all events for the user.
   */
  public sendUnsubscribe(): void {
    const envelope: ClientMessageEnvelope = {
      tid: UUID.nanoid(),
      action: ClientAction.Unsubscribe,
      data: {
        channel: this.userId,
      },
    };

    this.send(envelope);
  }

  /**
   * Adds a message event listener, called when a message event is received
   * from the Courier WebSocket server.
   *
   * @param listener The listener function
   */
  public addMessageEventListener(listener: (message: InboxMessageEventEnvelope) => void): void {
    this.messageEventListeners.push(listener);
  }

  /**
   * Send a ping message to the server.
   *
   * ping/pong is implemented at the application layer since the browser's
   * WebSocket implementation does not support control-level ping/pong.
   */
  private sendPing(): void {
    if (this.pingTransactionManager.outstandingRequests.length >= this.maxOutstandingPings) {
      this.logger?.debug('Max outstanding pings reached, retrying connection.');
      this.close(CLOSE_CODE_NORMAL_CLOSURE, 'Max outstanding pings reached, retrying connection.');
      this.retryConnection();

      return;
    }

    const envelope: ClientMessageEnvelope = {
      tid: UUID.nanoid(),
      action: ClientAction.Ping,
    };

    this.send(envelope);
    this.pingTransactionManager.addOutstandingRequest(envelope.tid, envelope);
  }

  /**
   * Send a pong response to the server.
   *
   * ping/pong is implemented at the application layer since the browser's
   * WebSocket implementation does not support control-level ping/pong.
   */
  private sendPong(incomingMessage: ServerActionEnvelope): void {
    const response: ClientMessageEnvelope = {
      tid: incomingMessage.tid,
      action: ClientAction.Pong,
    };

    this.send(response);
  }

  /**
   * Send a request for the client's configuration.
   */
  private sendGetConfig(): void {
    const envelope: ClientMessageEnvelope = {
      tid: UUID.nanoid(),
      action: ClientAction.GetConfig,
    };

    this.send(envelope);
  }

  /**
   * Restart the ping interval, clearing the previous interval if it exists.
   */
  private restartPingInterval(): void {
    if (this.pingIntervalId) {
      window.clearInterval(this.pingIntervalId);
    }

    this.pingIntervalId = window.setInterval(() => {
      this.sendPing();
    }, this.pingInterval);
  }

  private get pingInterval(): number {
    if (this.config) {
      // Server-provided ping interval is in seconds.
      return this.config.pingInterval * 1000;
    }

    return CourierInboxSocket.DEFAULT_PING_INTERVAL_MILLIS;
  }

  private get maxOutstandingPings(): number {
    if (this.config) {
      return this.config.maxOutstandingPings;
    }

    return CourierInboxSocket.DEFAULT_MAX_OUTSTANDING_PINGS;
  }

  private setConfig(config: Config): void {
    this.config = config;
  }

  private static isInboxMessageEvent(event: string): event is InboxMessageEvent {
    return Object.values(InboxMessageEvent).includes(event as InboxMessageEvent);
  }
}
