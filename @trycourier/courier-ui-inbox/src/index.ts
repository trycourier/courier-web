import { CourierInbox } from './components/courier-inbox';
import { CourierInboxHeader } from './components/courier-inbox-header';
import { CourierListItem } from './components/courier-inbox-list-item';

export * from './components/courier-inbox';

// Register web components
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}

if (!customElements.get('courier-list-item')) {
  customElements.define('courier-list-item', CourierListItem);
}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
