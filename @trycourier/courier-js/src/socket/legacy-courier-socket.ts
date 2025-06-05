import { CourierClientOptions } from "../client/courier-client";

export class CourierSocket {

  // Constants
  private static readonly NORMAL_CLOSURE_STATUS = 1000;

  // Properties
  private webSocket: WebSocket | null = null;
  private pingInterval: number | null = null;

  // Callbacks
  public onOpen?: () => void;
  public onMessageReceived?: (message: string) => void;
  public onClose?: (code: number, reason?: string) => void;
  public onError?: (error: Error) => void;

  // Properties
  private readonly url: string;
  readonly options: CourierClientOptions;

  constructor(url: string, options: CourierClientOptions) {
    this.url = url;
    this.options = options;
  }

  /**
   * Dynamically checks if the WebSocket is connected
   */
  public get isConnected(): boolean {
    return this.webSocket !== null;
  }

  public async connect(): Promise<void> {
    // Disconnect if already connected
    this.disconnect();

    return new Promise((resolve, reject) => {
      try {
        this.webSocket = new WebSocket(this.url);

        this.webSocket.addEventListener('open', () => {
          this.onOpen?.();
          resolve();
        };

        this.webSocket.onmessage = (event) => {
          this.onMessageReceived?.(event.data);
        };

        this.webSocket.onclose = (event) => {
          this.webSocket = null;
          this.onClose?.(event.code, event.reason);
        };

        this.webSocket.onerror = (event) => {
          this.webSocket = null;
          const error = new Error('Courier Socket connection failed');
          (error as any).originalEvent = event;
          this.onError?.(error);
          reject(error);
        };

      } catch (error) {
        this.webSocket = null;
        reject(error);
      }
    });
  }

  public disconnect(): void {
    this.stopPing();
    if (this.webSocket) {
      this.webSocket.close(CourierSocket.NORMAL_CLOSURE_STATUS);
      this.webSocket = null;
    }
  }

  public async send(message: Record<string, any>): Promise<boolean> {
    if (!this.webSocket) {
      return false;
    }

    const json = JSON.stringify(message);
    return this.webSocket.send(json) !== undefined;
  }

  public keepAlive(props?: {
    intervalInMillis?: number;
  }): void {
    this.stopPing();
    this.pingInterval = window.setInterval(async () => {
      try {
        await this.send({ action: 'keepAlive' });
      } catch (error) {
        this.options.logger?.error('Error occurred on Keep Alive:', error);
      }
    }, props?.intervalInMillis ?? 300_000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

}
