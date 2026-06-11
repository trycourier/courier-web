// Import core UI components
import { CourierButton } from './components/courier-button';
import { CourierIcon } from './components/courier-icon';
import { CourierLink } from './components/courier-link';
import { CourierInfoState } from './components/courier-info-state';
import { CourierIconButton } from './components/courier-icon-button';
import { CourierSystemThemeElement } from './components/courier-system-theme-element';
import { CourierRadio } from './components/courier-radio';
import { CourierCheckbox } from './components/courier-checkbox';
import { registerElement } from './utils/registeration';

// Export all components for external use
export * from './components/courier-button';
export * from './components/courier-icon';
export * from './components/courier-link';
export * from './components/courier-info-state';
export * from './components/courier-icon-button';
export * from './components/courier-element';
export * from './components/courier-system-theme-element';
export * from './components/courier-base-element';
export * from './components/courier-radio';
export * from './components/courier-checkbox';
export * from './utils/system-theme-mode';
export * from './utils/theme';
export * from './utils/courier-colors';
export * from './utils/registeration';
export * from './utils/sanitize-url';

// Export theme management
export * from './managers/courier-theme-manager';
export * from './types/common-theme-types';

// Register core UI components
registerElement(CourierButton);
registerElement(CourierIcon);
registerElement(CourierLink);
registerElement(CourierInfoState);
registerElement(CourierIconButton);
registerElement(CourierSystemThemeElement);
registerElement(CourierRadio);
registerElement(CourierCheckbox);