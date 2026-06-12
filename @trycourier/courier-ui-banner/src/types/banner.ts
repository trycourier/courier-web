import { InboxAction, InboxMessage } from "@trycourier/courier-js";

/**
 * Controls how a posted banner is presented.
 *
 * - `banner` (default): an inline, full-width strip rendered at the location of the
 *   `<courier-banner>` element in the DOM. Most teams place this at the top of the page.
 * - `popup`: an overlay/modal card rendered above the page, anchored via
 *   {@link CourierBannerPosition}. Optionally backed by a dimmed backdrop.
 * - `custom`: the consumer owns rendering entirely via a factory / render prop. The theme
 *   is intentionally not applied — same contract as custom inbox list items.
 *
 * @public
 */
export type CourierBannerLayout = 'banner' | 'popup' | 'custom';

/**
 * Anchoring position for the `popup` layout.
 *
 * @public
 */
export type CourierBannerPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Options to display the banner dismiss button.
 *
 * - visible: always show the dismiss button
 * - hidden: always hide the dismiss button
 * - hover: only show the dismiss button when the banner is hovered
 * - auto (default): visible for manually-dismissed banners, hover for auto-dismiss banners
 *
 * @public
 */
export type CourierBannerDismissButtonOption = 'visible' | 'hidden' | 'hover' | 'auto';

/**
 * Props passed to a factory function used to create banner items or banner item content.
 *
 * @public
 */
export type CourierBannerItemFactoryProps = {
  /** The message for which the banner item is being created. */
  message: InboxMessage;

  /** The layout the banner is being rendered with. */
  layout: CourierBannerLayout;

  /** Whether a banner item will be auto-dismissed after {@link CourierBannerItemFactoryProps.autoDismissTimeoutMs} ms. */
  autoDismiss: boolean;

  /** The timeout before a banner item is auto-dismissed, if {@link CourierBannerItemFactoryProps.autoDismiss} is true. */
  autoDismissTimeoutMs: number;

  /** Dismiss the banner item associated with this message. */
  dismiss: () => void;
};

/**
 * Event metadata passed to the callback for {@link CourierBanner.onBannerItemClick}.
 *
 * @public
 */
export type CourierBannerItemClickEvent = {
  /** The message for the banner item that was clicked. */
  message: InboxMessage;
};

/**
 * Event metadata passed to the callback for {@link CourierBanner.onBannerItemActionClick}.
 *
 * @public
 */
export type CourierBannerItemActionClickEvent = {
  /** The message for the banner item that was clicked. */
  message: InboxMessage;

  /** The action for the action button that was clicked. */
  action: InboxAction;
}

/**
 * Event metadata passed to the callback for {@link CourierBanner.onBannerItemDismissed}.
 *
 * @public
 */
export type CourierBannerItemDismissedEvent = {
  /** The message for the banner item that was dismissed. */
  message: InboxMessage;
};

/**
 * Resolve the expiry (epoch millis) for a message, if any.
 *
 * The inbox GraphQL read API does not return a top-level `expiresAt`, so we also look in
 * `message.data.expiresAt` — `data` is round-tripped by the read API, which lets an expiry
 * survive a feed reload.
 *
 * @public
 */
export function getMessageExpiresAt(message: InboxMessage): number | undefined {
  const fromData = message.data?.['expiresAt'];
  const value = message.expiresAt ?? (typeof fromData === 'number' ? fromData : undefined);
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/**
 * Whether a message has expired relative to `now` (epoch millis).
 *
 * @public
 */
export function isMessageExpired(message: InboxMessage, now: number): boolean {
  const expiresAt = getMessageExpiresAt(message);
  return expiresAt !== undefined && expiresAt <= now;
}
