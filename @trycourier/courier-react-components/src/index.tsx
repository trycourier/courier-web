// Import core Courier dependencies
import '@trycourier/courier-js';
import '@trycourier/courier-ui-inbox';
import '@trycourier/courier-ui-toast';
import '@trycourier/courier-ui-preferences';

// Export local hooks
export { useCourier } from './hooks/use-courier';

// Export components and their props
export { CourierInboxComponent } from './components/courier-inbox-component';
export { CourierInboxPopupMenuComponent } from './components/courier-inbox-popup-menu-component';
export { CourierToastComponent } from './components/courier-toast-component';
export { CourierPreferencesComponent } from './components/courier-preferences-component';

export type {
  CourierInboxProps
} from './components/courier-inbox-component';

export type {
  CourierInboxPopupMenuProps,
} from './components/courier-inbox-popup-menu-component';

export type {
  CourierToastProps,
} from './components/courier-toast-component';

export type {
  CourierPreferencesProps,
} from './components/courier-preferences-component';

// Export render context, to be provided by dependent components
export { CourierRenderContext } from './context/render-context';
