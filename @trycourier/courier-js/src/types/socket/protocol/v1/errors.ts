/**
 * Regular expression to parse Courier-specific close event reasons.
 *
 * The WebSocket CloseEvent.reason property an opaque string up to interpretation
 * by the application layer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/reason
 */
export const COURIER_CLOSE_REASON = /(?<reason>.*) \((?<payload>{.*})\)/;

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
  retryAfter?: number;
}
