import { Courier, InboxMessage, InboxMessageEvent, InboxMessageEventEnvelope } from "@trycourier/courier-js";
import { CourierBannerDatastoreListener } from "./banner-datastore-listener";
import { getMessageExpiresAt, isMessageExpired } from "../types/banner";

/**
 * Shared datastore for Courier banners.
 *
 * This datastore listens to and stores Courier Inbox messages.
 *
 * @public
 */
export class CourierBannerDatastore {
  /** Shared instance. Access via {@link CourierBannerDatastore.shared}. */
  private static instance: CourierBannerDatastore;

  /** FIFO stack of banner messages. The end of the array is index 0 of the stack. */
  private _dataset: InboxMessage[] = [];

  /** Pending auto-removal timers, keyed by messageId, for messages with a future expiry. */
  private _expiryTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  /** Set of listeners whose handlers will be called when the datastore changes. */
  private _datastoreListeners: CourierBannerDatastoreListener[] = [];

  /** Cleanup function to remove the message event listener. */
  private _removeMessageEventListener?: () => void;

  /** The shared instance of CourierBannerDatastore, used to access all public methods. */
  public static get shared(): CourierBannerDatastore {
    if (!CourierBannerDatastore.instance) {
      CourierBannerDatastore.instance = new CourierBannerDatastore();
    }

    return CourierBannerDatastore.instance;
  }

  /**
   * Add a listener whose handlers are called when there are changes to the datastore.
   *
   * @param listener - an implementation of {@link CourierBannerDatastoreListener}
   */
  public addDatastoreListener(listener: CourierBannerDatastoreListener) {
    this._datastoreListeners.push(listener);
  }

  /**
   * Remove a previously added listener.
   *
   * Note: the `listener` param is matched by object reference, so callers must pass
   * the same object previously passed to {@link CourierBannerDatastore.addDatastoreListener}.
   *
   * See also: {@link CourierBannerDatastoreListener.remove}
   *
   * @param listener - a previously added listener implementation
   */
  public removeDatastoreListener(listener: CourierBannerDatastoreListener) {
    this._datastoreListeners = this._datastoreListeners.filter(l => l !== listener);
  }

  /**
   * Start listening for banner messages.
   *
   * Calling this method will open a WebSocket connection to the Courier backend if one
   * is not already open.
   *
   * See also: {@link @trycourier/courier-js#Courier.shared.signIn} and {@link @trycourier/courier-js#Courier.shared.signOut}
   */
  public async listenForMessages() {
    try {
      const socketClient = Courier.shared.client?.inbox.socket;

      if (!socketClient) {
        Courier.shared.client?.options.logger?.info('CourierInbox socket not available');
        return;
      }

      // Remove any existing listener before adding a new one
      // This prevents duplicates and handles socket changes
      if (this._removeMessageEventListener) {
        this._removeMessageEventListener();
      }

      // Register message event listener and store the cleanup function
      this._removeMessageEventListener = socketClient.addMessageEventListener((messageEvent: InboxMessageEventEnvelope) => {
        if (messageEvent.event === InboxMessageEvent.NewMessage) {
          const message: InboxMessage = messageEvent.data as InboxMessage;

          this.addMessage(message);
        }
      });

      // If the socket is already connecting or open, return early
      if (socketClient.isConnecting || socketClient.isOpen) {
        Courier.shared.client?.options.logger?.info(`Inbox socket already connecting or open for client ID: [${Courier.shared.client?.options.connectionId}]`);
        return;
      }

      await socketClient.connect();
    } catch (error: unknown) {
      Courier.shared.client?.options.logger.error('Error listening for messages:', error);
      this._datastoreListeners.forEach(listener => {
        listener.events.onError?.(error as Error);
      });
    }
  }

  /**
   * Find the position of an {@link @trycourier/courier-js#InboxMessage} in the banner stack.
   *
   * Notes:
   *  - Since the stack is an array, with the last item being the "top" of the stack,
   *    a banner's position in the underlying array is the inverse of its stack position.
   *  - `message` is matched by {@link @trycourier/courier-js#InboxMessage.messageId}, not by object reference.
   *
   * @param message - the {@link @trycourier/courier-js#InboxMessage} to find in the stack
   */
  public bannerIndexOfMessage(message: InboxMessage) {
    const position = this._dataset.findIndex(m => m.messageId === message.messageId);

    // Message not found
    if (position < 0) {
      return position;
    }

    // Return index from end of array (top of stack)
    return this._dataset.length - position - 1;
  }

  /**
   * Add an {@link @trycourier/courier-js#InboxMessage} banner item to the datastore.
   *
   * Calling this directly is useful to send test messages while developing with the Courier SDK.</p>
   *
   * @example
   * ```
   * CourierBannerDatastore.shared.addMessage({
   *  title: 'Lorem ipsum dolor sit',
   *  body: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
   *  messageId: '1'
   * });
   * ```
   *
   * Banners support expiry: if the message carries an `expiresAt` (top-level or in
   * `data.expiresAt`, epoch millis) that is already in the past, it is ignored. If the
   * expiry is in the future, the message is scheduled for automatic removal at that time
   * so a long-lived page stops showing it without a reload.
   *
   * @param message - the message to add as a banner item.
   */
  public addMessage(message: InboxMessage) {
    const now = Date.now();

    // Drop messages that have already expired.
    if (isMessageExpired(message, now)) {
      return;
    }

    this._dataset.push(message);
    this.scheduleExpiry(message, now);

    this._datastoreListeners.forEach(listener => {
      if (listener.events.onMessageAdd) {
        listener.events.onMessageAdd(message);
      }
    });
  }

  /** Schedule automatic removal of a message at its future expiry, if any. */
  private scheduleExpiry(message: InboxMessage, now: number) {
    const expiresAt = getMessageExpiresAt(message);
    if (expiresAt === undefined) {
      return;
    }

    const existing = this._expiryTimers.get(message.messageId);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      this._expiryTimers.delete(message.messageId);
      this.removeMessage(message);
    }, Math.max(0, expiresAt - now));

    this._expiryTimers.set(message.messageId, timer);
  }

  /**
   * Remove an {@link @trycourier/courier-js#InboxMessage} from the datastore.
   *
   * Note: `message` is matched by {@link @trycourier/courier-js#InboxMessage.messageId}, not by object reference
   */
  public removeMessage(message: InboxMessage) {
    const index = this._dataset.findIndex(m => m.messageId === message.messageId);
    if (index < 0) {
      return;
    }

    this._dataset.splice(index, /* deleteCount */ 1);

    const timer = this._expiryTimers.get(message.messageId);
    if (timer) {
      clearTimeout(timer);
      this._expiryTimers.delete(message.messageId);
    }

    this._datastoreListeners.forEach(listener => {
      if (listener.events.onMessageRemove) {
        listener.events.onMessageRemove(message);
      }
    });
  }

  /** Access the shared instance with {@link CourierBannerDatastore.shared}. */
  // Prevent instantiation via constructor.
  private constructor() {}
}
