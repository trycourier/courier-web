import { CourierClientOptions } from '../client/courier-client';
import { ClientAction, ClientMessageEnvelope, MessageEventEnvelope, ServerAction, ServerMessageEnvelope } from '../types/socket/protocol/v1/messages';
import { UUID } from '../utils/uuid';
import { CourierSocket } from './courier-socket';

/** Application-layer implementation of the Courier WebSocket API for Inbox messages. */
export class CourierInboxSocket extends CourierSocket {
  /**
   * The interval in milliseconds at which to send a ping message to the server
   * if no other message has been received from the server.
   */
  private static readonly PING_INTERVAL_MILLIS = 60_000; // 1 minute

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
  private messageEventListeners: ((message: MessageEventEnvelope) => void)[] = [];

  constructor(options: CourierClientOptions) {
    super(options);
  }

  public onOpen(_: Event): Promise<void> {
    this.restartPingInterval();

    return Promise.resolve();
  }

  public onMessageReceived(data: ServerMessageEnvelope | MessageEventEnvelope): Promise<void> {
    // Handle ping/pong messages.
    if ('action' in data && data.action === ServerAction.Ping) {
      const envelope: ServerMessageEnvelope = data as ServerMessageEnvelope;
      this.sendPong(envelope);
    }

    // Handle message events, calling all registered listeners.
    if ('event' in data) {
      for (const listener of this.messageEventListeners) {
        listener(data);
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
  public addMessageEventListener(listener: (message: MessageEventEnvelope) => void): void {
    this.messageEventListeners.push(listener);
  }

  /**
   * Send a ping message to the server.
   *
   * ping/pong is implemented at the application layer since the browser's
   * WebSocket implementation does not support control-level ping/pong.
   */
  private sendPing(): void {
    const envelope: ClientMessageEnvelope = {
      tid: UUID.nanoid(),
      action: ClientAction.Ping,
    };

    this.send(envelope);
  }

  /**
   * Send a pong response to the server.
   *
   * ping/pong is implemented at the application layer since the browser's
   * WebSocket implementation does not support control-level ping/pong.
   */
  private sendPong(incomingMessage: ServerMessageEnvelope): void {
    const response: ClientMessageEnvelope = {
      tid: incomingMessage.tid,
      action: ClientAction.Pong,
    };

    this.send(response);
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
    }, CourierInboxSocket.PING_INTERVAL_MILLIS);
  }
}
