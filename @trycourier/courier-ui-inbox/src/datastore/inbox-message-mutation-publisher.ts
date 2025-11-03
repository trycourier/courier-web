import { InboxMessage } from "@trycourier/courier-js"

export interface InboxMessageMutationSubscriber {
  handleMessage(message: InboxMessage): void;
}

export class InboxMessageMutationPublisher {
  private static instance: InboxMessageMutationPublisher;
  private readonly subscribers: InboxMessageMutationSubscriber[] = [];

  addSubscriber(subscriber: InboxMessageMutationSubscriber) {
    this.subscribers.push(subscriber);
  }

  publishMessage(message: InboxMessage) {
    this.subscribers.forEach(subscriber => {
      subscriber.handleMessage(message);
    });
  }

  static get shared(): InboxMessageMutationPublisher {
    if (!this.instance) {
      InboxMessageMutationPublisher.instance = new InboxMessageMutationPublisher();
    }

    return this.instance;
  }

  /** Private constructor prevents instantiation. */
  private constructor() {}
}
