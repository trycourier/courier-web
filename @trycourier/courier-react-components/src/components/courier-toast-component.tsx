import { useRef, useEffect, forwardRef, ReactNode, useContext, CSSProperties } from "react";
import { CourierInboxTheme, CourierToast as CourierToastElement, CourierToastItemFactoryProps, CourierToastItemAddedEvent, CourierToastItemDismissedEvent } from "@trycourier/courier-ui-inbox";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";
import { CourierRenderContext } from "../context/render-context";
import { CourierToastDismissButtonOption } from "@trycourier/courier-ui-inbox/dist/types/toast";

/** Props that may be passed to the {@link CourierToast} component. */
export interface CourierToastProps {
  /**
   * Styles applied to the {@link CourierToast} component.
   *
   * By default, the component has the following styles:
   *
   * ```css
   * position: "fixed";
   * width: "380px";
   * top: "30px";
   * right: "30px";
   * z-index: 999;
   * ```
   *
   * Setting styles directly on the component is useful to customize the component's
   * position and layout. Setting `height` is effectively a no-op, as `height`
   * will be dynamically set by the component as toast items are added and removed.
   */
  style?: CSSProperties;

  /** Theme object used to render the component when light mode is used. */
  lightTheme?: CourierInboxTheme;

  /** Theme object used to render the component when dark mode is used. */
  darkTheme?: CourierInboxTheme;

  /** Manually set the theme mode to one of "light", "dark", or "system". Defaults to "system". */
  mode?: CourierComponentThemeMode;

  /** Enable toasts to auto-dismiss, including a timer bar at the top of the toast. Defaults to false. */
  autoDismiss?: boolean;

  /**
   * The timeout before a toast auto-dismisses, if {@link CourierToastProps.autoDismiss} is enabled.
   * Defaults to 5000ms.
   */
  autoDismissTimeoutMs?: number;

  /**
   * Set the dismiss button's visibility.
   *
   * Defaults to "auto", which makes the button always visible if `autoDismiss` is false
   * and visible on hover if `autoDismiss` is true.
   */
  dismissButton?: CourierToastDismissButtonOption;

  /** Callback function invoked when a toast item is clicked. */
  onToastItemClick?: (props: CourierToastItemAddedEvent) => void;

  /** Callback function invoked when a toast item is dismissed. */
  onToastItemDismissed?: (props: CourierToastItemDismissedEvent) => void;

  /** Callback function invoked when a toast item is added. */
  onToastItemAdded?: (props: CourierToastItemAddedEvent) => void;

  /** Render prop specifying how to render an entire toast item. */
  renderToastItem?: (props: CourierToastItemFactoryProps | undefined | null) => ReactNode;

  /**
   * Render prop specifying how to render a toast item's content.
   *
   * The toast item's container, including the stack, auto-dismiss timer, and dismiss button
   * are still present when this prop is set.
   *
   * See {@link CourierToastProps.dismissButton} to customize the dismiss button's visibility and
   * {@link CourierToastProps.renderToastItem} to customize the entire toast item, including
   * its container.
   */
  renderToastItemContent?: (props: CourierToastItemFactoryProps | undefined | null) => ReactNode;
}

export const CourierToastComponent = forwardRef<CourierToastElement, CourierToastProps>((props, ref) => {
  const render = useContext(CourierRenderContext);
  if (!render) {
    throw new Error("RenderContext not found. Ensure CourierToast is wrapped in a CourierRenderContext.");
  }

  // Element ref for use in effects, updated by handleRef.
  const toastRef = useRef<CourierToastElement | null>(null);

  // Callback ref passed to rendered component, used to propagate the DOM element's ref to the parent component.
  // We use a callback ref (rather than a React.RefObject) since we want the parent ref to be up-to-date with
  // rendered component. Updating the parent ref via useEffect does not work, since mutating a RefObject
  // does not trigger useEffect (see https://stackoverflow.com/a/60476525).
  function handleRef(el: CourierToastElement | null) {
    if (ref) {

      // Propagate ref to ref callback functions
      if (typeof ref === 'function') {
        ref(el);
      } else {
        // Propagate ref to ref objects
        // @ts-ignore - RefObject.current is readonly in React 17, however it's not frozen and is equivalent the widened type MutableRefObject
        (ref as React.RefObject<CourierToastElement | null>).current = el;
      }
    }

    // Store the element for use in effects
    toastRef.current = el;
  }

  // Helper to get the current element
  function getEl(): CourierToastElement | null {
    return toastRef.current;
  }

  // Handle toast item clicked
  useEffect(() => {
    const toast = getEl();
    if (!toast) return;
    toast.onToastItemClick(props.onToastItemClick);
  }, [props.onToastItemClick]);

  // Handle toast item dismissed
  useEffect(() => {
    const toast = getEl();
    if (!toast) return;
    toast.onToastItemDismissed(props.onToastItemDismissed);
  }, [props.onToastItemDismissed]);

  // Handle toast item added
  useEffect(() => {
    const toast = getEl();
    if (!toast) return;
    toast.onToastItemAdded(props.onToastItemAdded);
  }, [props.onToastItemAdded]);

  // Render toast item
  useEffect(() => {
    const toast = getEl();
    if (!toast || !props.renderToastItem) return;
    queueMicrotask(() => {
      toast.setToastItem((itemProps?: CourierToastItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderToastItem!(itemProps);
        return render(reactNode);
      });
    });
  }, [props.renderToastItem]);

  // Render toast item content
  useEffect(() => {
    const toast = getEl();
    if (!toast || !props.renderToastItemContent) return;
    queueMicrotask(() => {
      toast.setToastItemContent((itemProps?: CourierToastItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderToastItemContent!(itemProps);
        return render(reactNode);
      });
    });
  }, [props.renderToastItemContent]);

  const children = (
    /* @ts-ignore */
    <courier-toast
      ref={handleRef}
      style={props.style}
      light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
      dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
      mode={props.mode}
      auto-dismiss={props.autoDismiss}
      auto-dismiss-timeout-ms={props.autoDismissTimeoutMs}
      dismiss-button={props.dismissButton}
    />
  );

  return (
    <CourierClientComponent children={children} />
  );
});
