import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierToastDatastoreListener } from "./toast-datastore-listener";

export class CourierToastDatastore {
  /** Shared instance. Access via {@link CourierToastDatastore.shared}. */
  private static instance: CourierToastDatastore;

  /** FIFO stack of toast messages. The end of the array is index 0 of the stack. */
  private _dataset: InboxMessage[] = [];

  /** Set of listeners whose handlers will be called when the datastore changes. */
  private _datastoreListeners: CourierToastDatastoreListener[] = [];

  public static get shared(): CourierToastDatastore {
    if (!CourierToastDatastore.instance) {
      CourierToastDatastore.instance = new CourierToastDatastore();
    }

    return CourierToastDatastore.instance;
  }

  public addDatastoreListener(listener: CourierToastDatastoreListener) {
    this._datastoreListeners.push(listener);
  }

  public removeDatastoreListener(listener: CourierToastDatastoreListener) {
    this._datastoreListeners = this._datastoreListeners.filter(l => l !== listener);
  }

  public async listenForMessages() {
    console.log(Courier.shared.client);
    try {
      const socketClient = Courier.shared.client?.inbox.socket;
      console.log(socketClient);

      if (!socketClient) {
        Courier.shared.client?.options.logger?.info('CourierInbox socket not available');
        return;
      }

      // If the socket is already connecting or open, return early
      if (socketClient.isConnecting || socketClient.isOpen) {
        Courier.shared.client?.options.logger?.info(`Inbox socket already connecting or open for client ID: [${Courier.shared.client?.options.connectionId}]`);
        return;
      }

      socketClient.addMessageEventListener((messageEvent: InboxMessageEventEnvelope) => {
        if (messageEvent.event === InboxMessageEvent.NewMessage) {
          const message: InboxMessage = messageEvent.data as InboxMessage;

          this.addMessage(message);
        }
      });

      socketClient.connect();
    } catch (error: unknown) {
      Courier.shared.client?.options.logger.error('Error listening for messages:', error);
      this._datastoreListeners.forEach(listener => {
        listener.events.onError?.(error as Error);
      });
    }
  }

  public toastIndexOfMessage(message: InboxMessage) {
    const position = this._dataset.findIndex(m => m.messageId === message.messageId);

    // Message not found
    if (position < 0) {
      return position;
    }

    // Return index from end of array (top of stack)
    return this._dataset.length - position - 1;
  }

  public addMessage(message: InboxMessage) {
    this._dataset.push(message);

    this._datastoreListeners.forEach(listener => {
      if (listener.events.onMessageAdd) {
        listener.events.onMessageAdd(message);
      }
    });
  }

  public removeMessage(message: InboxMessage) {
    const index = this._dataset.findIndex(m => m.messageId === message.messageId);
    if (index < 0) {
      return;
    }

    this._dataset.splice(index, /* deleteCount */ 1);

    this._datastoreListeners.forEach(listener => {
      if (listener.events.onMessageRemove) {
        listener.events.onMessageRemove(message);
      }
    });
  }

  /** Access the shared instance with {@link CourierToastDatastore.shared}. */
  // Prevent instantiation via constructor.
  private constructor() {}
}
