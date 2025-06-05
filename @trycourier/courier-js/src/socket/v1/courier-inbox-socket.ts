import { CourierClientOptions } from '../../client/courier-client';
import { ClientAction, ClientMessageEnvelope, MessageEventEnvelope, ServerAction, ServerMessageEnvelope } from '../../types/socket/protocol/v1/messages';
import { UUID } from '../../utils/uuid';
import { CourierSocket } from './courier-socket';

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

  private messageEventListeners: ((message: MessageEventEnvelope) => void)[] = [];

  constructor(options: CourierClientOptions) {
    super(options);
  }

  public onOpen(_: Event): Promise<void> {
    this.restartPingInterval();

    return Promise.resolve();
  }
  public onMessageReceived(data: ServerMessageEnvelope | MessageEventEnvelope): Promise<void> {
    if ('action' in data && data.action === ServerAction.Ping) {
      const envelope: ServerMessageEnvelope = data as ServerMessageEnvelope;
      this.sendPong(envelope);
    }

    if ('event' in data) {
      for (const listener of this.messageEventListeners) {
        listener(data);
      }
    }

    // Restart the ping interval if a message is received from the server.
    this.restartPingInterval();

    return Promise.resolve();
  }
  public onClose(event: CloseEvent): Promise<void> {
    this.logger?.debug('WebSocket closed', event);

    return Promise.resolve();
  }
  public onError(event: Event): Promise<void> {
    this.logger?.debug('WebSocket error', event);

    return Promise.resolve();
  }

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
