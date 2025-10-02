import { InboxMessage } from "@trycourier/courier-js";
import { CourierToastItem } from "../components/courier-toast-item";

/**
 * Options to display the toast dismiss button.
 *
 * - visible: always show the dismiss button
 * - hidden: always hide the dismiss button
 * - hover: only show the dismiss button when the toast is hovered
 * - auto (default): visible for manually-dismissed toasts, hover for auto-dismiss toasts
 */
export type CourierToastDismissButtonOption = 'visible' | 'hidden' | 'hover' | 'auto';

/** Props passed to a factory function used to create toast items or toast item content. */
export type CourierToastItemFactoryProps = {
  /** The message for which the toast item is being created. */
  message: InboxMessage;

  /** Whether a toast item will be auto-dismissed after {@link CourierToastItemFactoryProps.autoDismissTimeoutMs} ms. */
  autoDismiss: boolean;

  /** The timeout before a toast item is auto-dismissed, if {@link CourierToastItemFactoryProps.autoDismiss} is true. */
  autoDismissTimeoutMs: number;
};

/** Event metadata passed to the callback for {@link CourierToast.onToastItemClick}. */
export type CourierToastItemClickEvent = {
  /** The message that was clicked. */
  message: InboxMessage;

  /**
   * The toast item component clicked.
   *
   * Use toastItem to access properties and methods on the web component.
   *
   * @example
   * ```
   * toastItem.onToastItemClick((event) => {
   *   event.toastItem.dismiss();
   * });
   * ```
   */
  toastItem: CourierToastItem | HTMLElement;
};
