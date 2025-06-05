import { CourierClientOptions } from "../../client/courier-client";
import { CLOSE_CODE_NORMAL_CLOSURE } from "../../types/socket/protocol/v1/errors";
import { ReconnectMessage, ServerMessageEnvelope } from "../../types/socket/protocol/v1/messages";
import { MessageEventEnvelope } from "../../types/socket/protocol/v1/messages";
import { Logger } from "../../utils/logger";

/**
 * Abstract base class for Courier WebSocket implementations.
 *
 * The base class handles the connection and close events, as well as retry logic.
 * Application-specific logic should be implemented in the concrete classes.
 */
export abstract class CourierSocket {
  private static readonly IPW_VERSION = 'v1';

  private static readonly BACKOFF_JITTER_FACTOR = 0.5;
  private static readonly MAX_RETRY_ATTEMPTS = 5;

  /**
   * Backoff intervals in milliseconds.
   *
   * Each represents an offset from the previous interval, rather than a
   * absolute offset from the initial request time.
   */
  private static readonly BACKOFF_INTERVALS_IN_MILLIS = [
    30_000,  // 30 seconds
    60_000,  // 1 minute
    120_000, // 2 minutes
    240_000, // 4 minutes
    480_000, // 8 minutes
  ];

  private webSocket: WebSocket | null = null;
  private retryAttempt: number = 0;
  private retryTimeoutId: number | null = null;

  private readonly url: string;
  private readonly options: CourierClientOptions;

  constructor(
    options: CourierClientOptions
  ) {
    this.url = options.apiUrls.inbox.webSocket;
    this.options = options;
  }

  /**
   * Connects to the Courier WebSocket server.
   *
   * If the connection is already established, this is a no-op.
   *
   * @returns A promise that resolves when the connection is established or rejects if the connection could not be established.
   */
  public async connect(): Promise<void> {
    this.clearRetryTimeout();

    if (this.isConnecting || this.isOpen) {
      this.options.logger?.info('Attempted to open a WebSocket connection, but one already exists.');
      return Promise.reject(new Error('WebSocket connection already exists'));
    }

    return new Promise((resolve, reject) => {
      this.webSocket = new WebSocket(this.getWebSocketUrl());

      this.webSocket.addEventListener('open', (event: Event) => {
        // Reset the retry attempt counter when the connection is established.
        this.retryAttempt = 0;

        this.onOpen(event);

        // Resolve the promise when the WebSocket is opened (i.e. the connection is established)
        resolve();
      });

      this.webSocket.addEventListener('message', (event: MessageEvent) => {
        try {
          const json = JSON.parse(event.data) as ServerMessageEnvelope | MessageEventEnvelope | ReconnectMessage;
          if ('event' in json && json.event === 'reconnect') {
            this.retryConnection(json.retryAfter * 1000);
            return;
          }

          this.onMessageReceived(json)
        } catch (error) {
          this.options.logger?.error('Error parsing socket message', error);
        }
      });

      this.webSocket.addEventListener('close', (event: CloseEvent) => {
        if (event.code !== CLOSE_CODE_NORMAL_CLOSURE) {
          const suggestedRetryAfterInMillis = CourierSocket.parseRetryAfterInMillis(event);

          if (suggestedRetryAfterInMillis) {
            this.retryConnection(suggestedRetryAfterInMillis);
          } else {
            this.retryConnection();
          }
        }

        this.onClose(event);
      });

      this.webSocket.addEventListener('error', (event: Event) => {
        this.retryConnection();
        this.onError(event);

        // If the HTTP Upgrade request fails, the WebSocket API fires an error event,
        // so we reject the promise to indicate that the connection could not be established.
        reject(event);
      });
    });
  }

  public close(code: number, reason?: string): void {
    if (this.webSocket === null) {
      return;
    }

    this.webSocket.close(code, reason);
  }

  public send(message: Record<string, any>): void {
    if (this.webSocket === null || this.isConnecting) {
      this.options.logger?.info('Attempted to send a message, but the WebSocket is not yet open.');
      return;
    }

    const json = JSON.stringify(message);
    this.webSocket.send(json);
  }

  protected get userId(): string {
    return this.options.userId;
  }

  protected get logger(): Logger | undefined {
    return this.options.logger;
  }

  public abstract onOpen(event: Event): Promise<void>;

  public abstract onMessageReceived(data: ServerMessageEnvelope | MessageEventEnvelope): Promise<void>;

  public abstract onClose(event: CloseEvent): Promise<void>;

  public abstract onError(event: Event): Promise<void>;

  public get isConnecting(): boolean {
    return this.webSocket !== null && this.webSocket.readyState === WebSocket.CONNECTING;
  }

  public get isOpen(): boolean {
    return this.webSocket !== null && this.webSocket.readyState === WebSocket.OPEN;
  }

  private getWebSocketUrl(): string {
    const accessToken = this.options.accessToken;
    const connectionId = this.options.connectionId;
    const userId = this.userId;

    return `${this.url}?auth=${accessToken}&cid=${connectionId}&iwpv=${CourierSocket.IPW_VERSION}&userId=${userId}`;
  }

  /**
   * Parses the Retry-After time from the WebSocket close event reason.
   * The Courier WebSocket server may send the close event reason in the following format:
   *
   * ```json
   * {
   *   "Retry-After": "10" // The retry after time in seconds
   * }
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/reason
   *
   * @param closeEvent The WebSocket close event.
   * @returns The retry after time in milliseconds or null if the retry after time could not be parsed.
   */
  private static parseRetryAfterInMillis(closeEvent: CloseEvent): number | null {
    if (closeEvent.reason === null || closeEvent.reason === '') {
      return null;
    }

    try {
      const jsonReason = JSON.parse(closeEvent.reason);
      if (!jsonReason['Retry-After']) {
        return null;
      }

      const retryAfterInMillis = parseInt(jsonReason['Retry-After']) * 1000;
      if (Number.isNaN(retryAfterInMillis) || retryAfterInMillis < 0) {
        return null;
      }

      return retryAfterInMillis;
    } catch (error) {
      return null;
    }
  }

  private getBackoffTimeInMillis(): number {
    const backoffIntervalInMillis = CourierSocket.BACKOFF_INTERVALS_IN_MILLIS[this.retryAttempt];
    const lowerBound = backoffIntervalInMillis - (backoffIntervalInMillis * CourierSocket.BACKOFF_JITTER_FACTOR);
    const upperBound = backoffIntervalInMillis + (backoffIntervalInMillis * CourierSocket.BACKOFF_JITTER_FACTOR);

    return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
  }

  private async retryConnection(suggestedBackoffTimeInMillis?: number): Promise<void> {
    if (this.retryTimeoutId !== null) {
      this.logger?.debug('Skipping retry attempt because a previous retry is already scheduled.');
      return;
    }

    if (this.retryAttempt >= CourierSocket.MAX_RETRY_ATTEMPTS) {
      this.logger?.error(`Max retry attempts (${CourierSocket.MAX_RETRY_ATTEMPTS}) reached.`);
      return;
    }

    const backoffTimeInMillis = suggestedBackoffTimeInMillis ?? this.getBackoffTimeInMillis();
    this.retryTimeoutId = window.setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        // connect() will retry if applicable
      }
    }, backoffTimeInMillis);
    this.logger?.debug(`Retrying connection in ${Math.floor(backoffTimeInMillis / 1000)}s. Retry attempt ${this.retryAttempt + 1} of ${CourierSocket.MAX_RETRY_ATTEMPTS}.`);

    this.retryAttempt++;
  }

  private clearRetryTimeout(): void {
    if (this.retryTimeoutId !== null) {
      window.clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }
}
