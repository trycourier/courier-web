import { InboxAction, InboxMessage } from "@trycourier/courier-js";

/**
 * Options to display the toast dismiss button.
 *
 * - visible: always show the dismiss button
 * - hidden: always hide the dismiss button
 * - hover: only show the dismiss button when the toast is hovered
 * - auto (default): visible for manually-dismissed toasts, hover for auto-dismiss toasts
 *
 * @public
 */
export type CourierToastDismissButtonOption = 'visible' | 'hidden' | 'hover' | 'auto';

/**
 * Props passed to a factory function used to create toast items or toast item content.
 *
 * @public
 */
export type CourierToastItemFactoryProps = {
  /** The message for which the toast item is being created. */
  message: InboxMessage;

  /** Whether a toast item will be auto-dismissed after {@link CourierToastItemFactoryProps.autoDismissTimeoutMs} ms. */
  autoDismiss: boolean;

  /** The timeout before a toast item is auto-dismissed, if {@link CourierToastItemFactoryProps.autoDismiss} is true. */
  autoDismissTimeoutMs: number;
};

/**
 * Event metadata passed to the callback for {@link CourierToast.onToastItemClick}.
 *
 * @public
 */
export type CourierToastItemClickEvent = {
  /** The message for the toast item that was clicked. */
  message: InboxMessage;
};

/**
 * Event metadata passed to the callback for {@link CourierToast.onToastItemActionClick}.
 *
 * @public
 */
export type CourierToastItemActionClickEvent = {
  /** The message for the toast item that was clicked. */
  message: InboxMessage;

  /** The action for the action button that was clicked. */
  action: InboxAction;
}
