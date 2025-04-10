// Import core UI components
import { CourierButton } from './components/button';
import { CourierIcon } from './components/icon';
import { CourierLink } from './components/link';

// Export all components for external use
export * from './components/button';
export * from './components/icon';
export * from './components/link';

// Define array of web components to register
const components = [
  { name: 'courier-button', class: CourierButton },
  { name: 'courier-icon', class: CourierIcon },
  { name: 'courier-link', class: CourierLink },
] as const;

// Register each component if not already registered
components.forEach(({ name, class: componentClass }) => {
  if (!customElements.get(name)) {
    customElements.define(name, componentClass);
  }
});