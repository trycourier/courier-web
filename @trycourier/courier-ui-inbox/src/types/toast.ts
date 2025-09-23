/**
 * Options to display the toast dismiss button.
 *
 * - enabled: always show the dismiss button
 * - disabled: always hide the dismiss button
 * - hover: only show the dismiss button when the toast is hovered
 * - auto (default): enabled for manually-dismissed toasts, hover for auto-dismiss toasts
 */
export type CourierToastDismissButtonOption = 'enabled' | 'disabled' | 'hover' | 'auto';

export type CourierToastLayoutProps = {
  position?: string;
  height?: string;
  width?: string;
  top?: string;
  right?: string;
  zIndex?: string;
}
