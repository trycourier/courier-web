// Import core UI components
import { CourierButton } from './components/courier-button';
import { CourierIcon } from './components/courier-icon';
import { CourierLink } from './components/courier-link';
import { CourierInfoState } from './components/courier-info-state';
import { CourierIconButton } from './components/courier-icon-button';
import { CourierSystemThemeElement } from './components/courier-system-theme-element';
import { registerElement } from './utils/register-element';

// Export all components for external use
export * from './components/courier-button';
export * from './components/courier-icon';
export * from './components/courier-link';
export * from './components/courier-info-state';
export * from './components/courier-icon-button';
export * from './components/courier-element';
export * from './components/courier-system-theme-element';
export * from './components/base-element';
export * from './utils/system-theme-mode';
export * from './utils/theme';
export * from './utils/courier-colors';
export * from './utils/register-element';

// Define array of web components to register
const components = [
  { name: 'courier-button', class: CourierButton },
  { name: 'courier-icon', class: CourierIcon },
  { name: 'courier-link', class: CourierLink },
  { name: 'courier-info-state', class: CourierInfoState },
  { name: 'courier-icon-button', class: CourierIconButton },
  { name: 'courier-system-theme', class: CourierSystemThemeElement },
] as const;

// Register each component if not already registered
components.forEach(({ name, class: componentClass }) => registerElement(name, componentClass));