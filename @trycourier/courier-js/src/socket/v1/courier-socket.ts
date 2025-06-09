import { CourierClientOptions } from "../../client/courier-client";
import { CLOSE_CODE_NORMAL_CLOSURE, CourierCloseEvent } from "../../types/socket/protocol/v1/errors";
import { ReconnectMessage, ServerMessageEnvelope } from "../../types/socket/protocol/v1/messages";
import { MessageEventEnvelope } from "../../types/socket/protocol/v1/messages";
import { Logger } from "../../utils/logger";
import { IPW_VERSION } from "./version";

/**
 * Abstract base class for Courier WebSocket implementations.
 *
 * The base class handles the connection and close events, as well as retry logic.
 * Application-specific logic should be implemented in the concrete classes.
 */
export abstract class CourierSocket {
  /**
   * The jitter factor for the backoff intervals.
   *
   * Backoff with jitter is calculated as a random value in the range:
   * [BACKOFF_INTERVAL - BACKOFF_JITTER_FACTOR * BACKOFF_INTERVAL,
   *  BACKOFF_INTERVAL + BACKOFF_JITTER_FACTOR * BACKOFF_INTERVAL).
   */
  private static readonly BACKOFF_JITTER_FACTOR = 0.5;

  /**
   * The maximum number of retry attempts.
   */
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

  /**
   * The key of the retry after time in the WebSocket close event reason.
   *
   * The Courier WebSocket server may send the close event reason in the following format:
   *
   * ```json
   * {
   *   "Retry-After": "10" // The retry after time in seconds
   * }
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/reason
   */
  private static readonly RETRY_AFTER_KEY = 'Retry-After';

  /** The WebSocket instance, which may be null if the connection is not established. */
  private webSocket: WebSocket | null = null;

  /** The number of connection retry attempts so far, reset after a successful connection. */
  private retryAttempt: number = 0;

  /** The timeout ID for the current connectionretry attempt, reset when we attempt to connect. */
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

      this.webSocket.addEventListener('message', async (event: MessageEvent) => {
        try {
          const json = JSON.parse(event.data) as ServerMessageEnvelope | MessageEventEnvelope | ReconnectMessage;
          if ('event' in json && json.event === 'reconnect') {
            this.close(CLOSE_CODE_NORMAL_CLOSURE);
            await this.retryConnection(json.retryAfter * 1000);
            return;
          }

          this.onMessageReceived(json)
        } catch (error) {
          this.options.logger?.error('Error parsing socket message', error);
        }
      });

      this.webSocket.addEventListener('close', (event: CloseEvent) => {
        if (event.code !== CLOSE_CODE_NORMAL_CLOSURE) {
          const courierCloseEvent = CourierSocket.parseCloseEvent(event);

          if (courierCloseEvent.retryAfterSeconds) {
            this.retryConnection(courierCloseEvent.retryAfterSeconds * 1000);
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

  /**
   * Closes the WebSocket connection.
   *
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close} for more details.
   *
   * @param code The WebSocket close code. Defaults to {@link CLOSE_CODE_NORMAL_CLOSURE}.
   * @param reason The WebSocket close reason.
   */
  public close(code = CLOSE_CODE_NORMAL_CLOSURE, reason?: string): void {
    if (this.webSocket === null) {
      return;
    }

    this.webSocket.close(code, reason);
    this.webSocket = null;
  }

  /**
   * Sends a message to the Courier WebSocket server.
   *
   * @param message The message to send. The message will be serialized to a JSON string.
   */
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

  /**
   * Called when the WebSocket connection is established with the Courier WebSocket server.
   *
   * @param event The WebSocket open event.
   */
  public abstract onOpen(event: Event): Promise<void>;

  /**
   * Called when a message is received from the Courier WebSocket server.
   *
   * @param data The message received.
   */
  public abstract onMessageReceived(data: ServerMessageEnvelope | MessageEventEnvelope): Promise<void>;

  /**
   * Called when the WebSocket connection is closed.
   *
   * @param event The WebSocket close event.
   */
  public abstract onClose(event: CloseEvent): Promise<void>;

  /**
   * Called when an error occurs on the WebSocket connection.
   *
   * @param event The WebSocket error event.
   */
  public abstract onError(event: Event): Promise<void>;

  /**
   * Whether the WebSocket connection is currently being established.
   */
  public get isConnecting(): boolean {
    return this.webSocket !== null && this.webSocket.readyState === WebSocket.CONNECTING;
  }

  /**
   * Whether the WebSocket connection is currently open.
   */
  public get isOpen(): boolean {
    return this.webSocket !== null && this.webSocket.readyState === WebSocket.OPEN;
  }

  /**
   * Constructs the WebSocket URL for the Courier WebSocket server using context
   * from the {@link CourierClientOptions} passed to the constructor.
   *
   * @returns The WebSocket URL
   */
  private getWebSocketUrl(): string {
    const accessToken = this.options.accessToken;
    const connectionId = this.options.connectionId;
    const userId = this.userId;

    return `${this.url}?auth=${accessToken}&cid=${connectionId}&iwpv=${IPW_VERSION}&userId=${userId}`;
  }

  /**
   * Parses the Retry-After time from the WebSocket close event reason,
   * and returns a new {@link CourierCloseEvent} with the retry after time in seconds
   * if present.
   *
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
   * @returns The WebSocket close event with the retry after time in seconds.
   */
  private static parseCloseEvent(closeEvent: CloseEvent): CourierCloseEvent {
    if (closeEvent.reason === null || closeEvent.reason === '') {
      return closeEvent;
    }

    try {
      const jsonReason = JSON.parse(closeEvent.reason);
      if (!jsonReason[CourierSocket.RETRY_AFTER_KEY]) {
        return closeEvent;
      }

      const retryAfterSeconds = parseInt(jsonReason[CourierSocket.RETRY_AFTER_KEY]);
      if (Number.isNaN(retryAfterSeconds) || retryAfterSeconds < 0) {
        return closeEvent;
      }

      return {
        ...closeEvent,
        retryAfterSeconds,
      };
    } catch (error) {
      return closeEvent;
    }
  }

  /**
   * Calculates the retry backoff time in milliseconds based on the current retry attempt.
   */
  private getBackoffTimeInMillis(): number {
    const backoffIntervalInMillis = CourierSocket.BACKOFF_INTERVALS_IN_MILLIS[this.retryAttempt];
    const lowerBound = backoffIntervalInMillis - (backoffIntervalInMillis * CourierSocket.BACKOFF_JITTER_FACTOR);
    const upperBound = backoffIntervalInMillis + (backoffIntervalInMillis * CourierSocket.BACKOFF_JITTER_FACTOR);

    return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
  }

  /**
   * Retries the connection to the Courier WebSocket server after
   * either {@param suggestedBackoffTimeInMillis} or a random backoff time
   * calculated using {@link getBackoffTimeInMillis}.
   *
   * @param suggestedBackoffTimeInMillis The suggested backoff time in milliseconds.
   * @returns A promise that resolves when the connection is established or rejects if the connection could not be established.
   */
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

  /**
   * Clears the retry timeout if it exists.
   */
  private clearRetryTimeout(): void {
    if (this.retryTimeoutId !== null) {
      window.clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }
}
