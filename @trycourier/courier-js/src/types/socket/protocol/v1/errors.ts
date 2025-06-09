/**
 * Connection close code for non-error conditions.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
 */
export const CLOSE_CODE_NORMAL_CLOSURE = 1000;

/**
 * Courier-specific close event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
 */
export interface CourierCloseEvent extends CloseEvent {
  /** The number of seconds to wait before retrying the connection. */
  retryAfterSeconds?: number;
}
