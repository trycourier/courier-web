import { CourierInbox } from './inbox/inbox';

export * from './inbox/inbox';

// Register web components
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}