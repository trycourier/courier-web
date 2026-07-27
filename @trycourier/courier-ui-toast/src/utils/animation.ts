/**
 * How long a toast's exit animation runs, in milliseconds.
 *
 * Shared by the `courier-toast-hide` keyframes in {@link CourierToast}'s styles
 * and the delay {@link CourierToastItem} waits before removing itself, so the
 * element leaves the DOM exactly as the animation lands instead of being cut off
 * partway through it.
 */
export const TOAST_DISMISS_ANIMATION_MS = 300;
