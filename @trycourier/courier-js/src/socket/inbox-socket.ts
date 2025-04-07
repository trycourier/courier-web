import { CourierSocket } from './courier-socket';
import { CourierClientOptions } from '../client/courier-client';
import { InboxMessage } from '../types/inbox';

enum PayloadType {
  EVENT = 'event',
  MESSAGE = 'message'
}

enum EventType {
  READ = 'read',
  UNREAD = 'unread',
  MARK_ALL_READ = 'mark-all-read',
  OPENED = 'opened',
  UNOPENED = 'unopened',
  ARCHIVE = 'archive',
  UNARCHIVE = 'unarchive',
  CLICK = 'click',
  UNCLICK = 'unclick'
}

interface SocketPayload {
  type: PayloadType;
}

interface MessageEvent {
  event: EventType;
  messageId?: string;
  type: string;
}

export class InboxSocket extends CourierSocket {
  public receivedMessage?: (message: InboxMessage) => void;
  public receivedMessageEvent?: (event: MessageEvent) => void;

  constructor(private readonly options: CourierClientOptions) {
    super(InboxSocket.buildUrl(options));
    this.onMessageReceived = (data) => this.convertToType(data);
  }

  private convertToType(data: string): void {
    try {
      const payload = JSON.parse(data) as SocketPayload;

      switch (payload.type) {
        case PayloadType.EVENT:
          const messageEvent = JSON.parse(data) as MessageEvent;
          this.receivedMessageEvent?.(messageEvent);
          break;

        case PayloadType.MESSAGE:
          const message = JSON.parse(data) as InboxMessage;
          this.receivedMessage?.(message);
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.onError?.(error);
      }
    }
  }

  public async sendSubscribe(props?: {
    version?: number;
  }): Promise<void> {
    const data: Record<string, any> = {
      action: 'subscribe',
      data: {
        userAgent: 'courier-js', // TODO: Equivalent to Courier.agent.value()
        channel: this.options.userId,
        event: '*',
        version: props?.version ?? 5,
      }
    };

    // Add optional parameters
    if (this.options.connectionId) {
      data.data.clientSourceId = this.options.connectionId;
    }
    if (this.options.publicApiKey) {
      data.data.clientKey = this.options.publicApiKey;
    }
    if (this.options.tenantId) {
      data.data.accountId = this.options.tenantId;
    }

    await this.send(data);
  }

  private static buildUrl(options: CourierClientOptions): string {
    let url = options.apiUrls?.inbox.webSocket ?? '';

    if (options.accessToken) {
      url += `/?auth=${options.accessToken}`;
    }

    return url;
  }
}
