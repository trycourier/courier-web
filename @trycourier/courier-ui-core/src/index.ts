import { CourierButton } from './button/button';

export * from './button/button';

// Register web components
if (!customElements.get('courier-button')) {
  customElements.define('courier-button', CourierButton);
}