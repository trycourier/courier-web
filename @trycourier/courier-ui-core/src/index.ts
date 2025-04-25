// Import core UI components
import { CourierButton } from './components/button';
import { CourierIcon } from './components/icon';
import { CourierLink } from './components/link';
import { CourierLoadingIndicator } from './components/loading-indicator';
import { CourierLoadingState } from './components/loading-state';
import { CourierInfoState } from './components/info-state';
import { CourierIconButton } from './components/icon-button';

// Export all components for external use
export * from './components/button';
export * from './components/icon';
export * from './components/link';
export * from './components/loading-indicator';
export * from './components/loading-state';
export * from './components/info-state';
export * from './components/icon-button';
export * from './components/courier-element';
export * from './components/courier-system-theme-element';
export * from './utils/system-theme-mode';

// Define array of web components to register
const components = [
  { name: 'courier-button', class: CourierButton },
  { name: 'courier-icon', class: CourierIcon },
  { name: 'courier-link', class: CourierLink },
  { name: 'courier-loading-indicator', class: CourierLoadingIndicator },
  { name: 'courier-loading-state', class: CourierLoadingState },
  { name: 'courier-info-state', class: CourierInfoState },
  { name: 'courier-icon-button', class: CourierIconButton },
] as const;

// Register each component if not already registered
components.forEach(({ name, class: componentClass }) => {
  if (!customElements.get(name)) {
    customElements.define(name, componentClass);
  }
});