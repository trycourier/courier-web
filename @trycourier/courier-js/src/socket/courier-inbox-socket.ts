import { CourierClientOptions } from '../client/courier-client';
import { ClientAction, ClientMessageEnvelope, ServerMessageEnvelope } from '../types/socket/protocol/v1/messages';
import { UUID } from '../utils/uuid';
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

  constructor(options: CourierClientOptions) {
    super(options);
  }

  public onOpen(_: Event): Promise<void> {
    this.restartPingInterval();

    return Promise.resolve();
  }
  public onMessageReceived(_: MessageEvent): Promise<void> {
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

    this.logger?.debug('Sending subscribe request', envelope);
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

    this.logger?.debug('Sending unsubscribe request', envelope);
    this.send(envelope);
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

    this.logger?.debug('Sending ping request', envelope);
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

    this.logger?.debug('Sending pong response', response);
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
