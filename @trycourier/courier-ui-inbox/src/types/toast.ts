import { InboxMessage } from "@trycourier/courier-js";
import { CourierToastItem } from "../components/courier-toast-item";

/**
 * Options to display the toast dismiss button.
 *
 * - enabled: always show the dismiss button
 * - disabled: always hide the dismiss button
 * - hover: only show the dismiss button when the toast is hovered
 * - auto (default): enabled for manually-dismissed toasts, hover for auto-dismiss toasts
 */
export type CourierToastDismissButtonOption = 'enabled' | 'disabled' | 'hover' | 'auto';

/** Props passed to a factory function used to create toast items or toast item content. */
export type CourierToastItemFactoryProps = {
  /** The message for which the toast item is being created. */
  message: InboxMessage;

  /** Whether a toast item will be auto-dismissed after {@link CourierToastItemFactoryProps.autoDismissTimeoutMs} ms. */
  autoDismiss: boolean;

  /** The timeout before a toast item is auto-dismissed, if {@link CourierToastItemFactoryProps.autoDismiss} is true. */
  autoDismissTimeoutMs: number;
};

/** Event metadata passed to the callback for {@link CourierToast.onToastItemAdded}. */
export type CourierToastItemAddedEvent = {
  /** The message that was added. */
  message: InboxMessage;

  /**
   * The toast item added.
   *
   * This is either an instance of {@link CourierToastItem} or an instance of {@link HTMLElement}
   * if {@link CourierToast.setToastItem} was called to set a custom HTML Element as the toast item.
   */
  toastItem: CourierToastItem | HTMLElement;
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
  toastItem: CourierToastItem;
};

/**
 * Event metadata passed to the callback for {@link CourierToast.onToastItemDismissed}.
 *
 * Unlike other toast events, dismissed does not include the element for which the event was fired,
 * since it has been removed from the DOM.
 */
export type CourierToastItemDismissedEvent = {
  /** The message that was removed. */
  message: InboxMessage;
};

