// Import core UI components
import { CourierButton } from './components/courier-button';
import { CourierIcon } from './components/courier-icon';
import { CourierLink } from './components/courier-link';
import { CourierInfoState } from './components/courier-info-state';
import { CourierIconButton } from './components/courier-icon-button';

// Export all components for external use
export * from './components/courier-button';
export * from './components/courier-icon';
export * from './components/courier-link';
export * from './components/courier-info-state';
export * from './components/courier-icon-button';
export * from './components/courier-element';
export * from './components/courier-system-theme-element';
export * from './utils/system-theme-mode';
export * from './utils/theme';
export * from './utils/courier-colors';

// Define array of web components to register
const components = [
  { name: 'courier-button', class: CourierButton },
  { name: 'courier-icon', class: CourierIcon },
  { name: 'courier-link', class: CourierLink },
  { name: 'courier-info-state', class: CourierInfoState },
  { name: 'courier-icon-button', class: CourierIconButton },
] as const;

// Register each component if not already registered
components.forEach(({ name, class: componentClass }) => {
  if (!customElements.get(name)) {
    customElements.define(name, componentClass);
  }
});