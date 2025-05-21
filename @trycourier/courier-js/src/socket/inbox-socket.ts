import { CourierSocket } from './courier-socket';
import { CourierClientOptions } from '../client/courier-client';
import { InboxMessage } from '../types/inbox';

interface SocketPayload {
  type: 'event' | 'message';
}

export interface MessageEvent {
  event: EventType;
  messageId?: string;
  type: string;
}

export type EventType =
  | 'archive-read'
  | 'archive'
  | 'click'
  | 'mark-all-read'
  | 'opened'
  | 'read'
  | 'unarchive'
  | 'unopened'
  | 'unread';

export class InboxSocket extends CourierSocket {

  public receivedMessage?: (message: InboxMessage) => void;
  public receivedMessageEvent?: (event: MessageEvent) => void;

  constructor(options: CourierClientOptions) {
    const url = InboxSocket.buildUrl(options);
    super(url, options);
    this.onMessageReceived = (data) => this.convertToType(data);
  }

  private convertToType(data: string): void {
    try {
      const payload = JSON.parse(data) as SocketPayload;

      switch (payload.type) {
        case 'event':
          const messageEvent = JSON.parse(data) as MessageEvent;
          this.receivedMessageEvent?.(messageEvent);
          break;

        case 'message':
          const message = JSON.parse(data) as InboxMessage;
          this.receivedMessage?.(message);
          break;
      }
    } catch (error) {
      this.options.logger?.error('Error parsing socket message', error);
      if (error instanceof Error) {
        this.onError?.(error);
      }
    }
  }

  public async sendSubscribe(props?: {
    version?: number;
  }): Promise<void> {
    const subscription: Record<string, any> = {
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
      subscription.data.clientSourceId = this.options.connectionId;
    }
    if (this.options.tenantId) {
      subscription.data.accountId = this.options.tenantId;
    }

    this.options.logger?.debug('Sending subscribe request', subscription);

    await this.send(subscription);
  }

  private static buildUrl(options: CourierClientOptions): string {
    let url = options.apiUrls?.inbox.webSocket ?? '';

    if (options.accessToken) {
      url += `/?auth=${options.accessToken}`;
    }

    return url;
  }
}
