import { CourierInbox } from './components/inbox';

export * from './components/inbox';

// Register web components
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}