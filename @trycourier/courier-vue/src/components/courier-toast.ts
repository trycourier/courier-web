import { defineComponent, h, ref, watch, type PropType, type StyleValue, type VNodeChild } from "vue";
import {
  CourierToast as CourierToastElement,
  type CourierToastDismissButtonOption,
  type CourierToastItemActionClickEvent,
  type CourierToastItemClickEvent,
  type CourierToastItemFactoryProps,
  type CourierToastTheme,
} from "@trycourier/courier-ui-toast";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { vNodeToHTMLElement } from "../utils/render";
import { bindCallback, jsonAttr, onElementReady } from "../utils/bindings";

/**
 * CourierToast Vue component — renders incoming inbox messages as transient
 * toast notifications.
 */
export const CourierToast = defineComponent({
  name: "CourierToast",
  props: {
    /** Inline styles applied to the component (e.g. to customize position). */
    style: { type: [String, Object, Array] as PropType<StyleValue>, default: undefined },
    /** Theme object for light mode. */
    lightTheme: { type: Object as PropType<CourierToastTheme>, default: undefined },
    /** Theme object for dark mode. */
    darkTheme: { type: Object as PropType<CourierToastTheme>, default: undefined },
    /** Theme mode: "light", "dark", or "system". Defaults to "system". */
    mode: { type: String as PropType<CourierComponentThemeMode>, default: undefined },
    /** Enable toasts to auto-dismiss, including a timer bar. Defaults to false. */
    autoDismiss: { type: Boolean, default: undefined },
    /** Timeout before a toast auto-dismisses, when `autoDismiss` is enabled. Defaults to 5000ms. */
    autoDismissTimeoutMs: { type: Number, default: undefined },
    /** Dismiss button visibility. Defaults to "auto". */
    dismissButton: { type: String as PropType<CourierToastDismissButtonOption>, default: undefined },
    /** Callback invoked when a toast item is clicked. */
    onToastItemClick: {
      type: Function as PropType<(props: CourierToastItemClickEvent) => void>,
      default: undefined,
    },
    /** Callback invoked when a toast item action button is clicked. */
    onToastItemActionClick: {
      type: Function as PropType<(props: CourierToastItemActionClickEvent) => void>,
      default: undefined,
    },
    /** Callback invoked once the component has registered its handlers and render props. */
    onReady: { type: Function as PropType<(ready: boolean) => void>, default: undefined },
    /** Render prop for an entire toast item (including its container). */
    renderToastItem: {
      type: Function as PropType<(props: CourierToastItemFactoryProps) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for a toast item's content (the container is preserved). */
    renderToastItemContent: {
      type: Function as PropType<(props: CourierToastItemFactoryProps) => VNodeChild>,
      default: undefined,
    },
  },
  setup(props, { expose }) {
    const elRef = ref<CourierToastElement | null>(null);

    expose({ getElement: () => elRef.value });

    onElementReady(elRef, (el) => {
      bindCallback(() => props.onToastItemClick, (cb) => el.onToastItemClick(cb));
      bindCallback(() => props.onToastItemActionClick, (cb) => el.onToastItemActionClick(cb));

      // Render the entire toast item, or reset to the default when not provided.
      watch(
        () => props.renderToastItem,
        (renderFn) => {
          if (!renderFn) {
            el.setToastItem();
            return;
          }
          queueMicrotask(() => {
            el.setToastItem((itemProps: CourierToastItemFactoryProps) => vNodeToHTMLElement(renderFn(itemProps)));
          });
        },
        { immediate: true }
      );

      // Render only the toast item's content, or reset to the default.
      watch(
        () => props.renderToastItemContent,
        (renderFn) => {
          if (!renderFn) {
            el.setToastItemContent();
            return;
          }
          queueMicrotask(() => {
            el.setToastItemContent((itemProps: CourierToastItemFactoryProps) =>
              vNodeToHTMLElement(renderFn(itemProps))
            );
          });
        },
        { immediate: true }
      );

      // Signal readiness once handlers and render props have been registered.
      queueMicrotask(() => props.onReady?.(true));
    });

    return () =>
      h("courier-toast", {
        ref: elRef,
        style: props.style,
        "light-theme": jsonAttr(props.lightTheme),
        "dark-theme": jsonAttr(props.darkTheme),
        mode: props.mode,
        "auto-dismiss": props.autoDismiss,
        "auto-dismiss-timeout-ms": props.autoDismissTimeoutMs,
        "dismiss-button": props.dismissButton,
      });
  },
});

export default CourierToast;
