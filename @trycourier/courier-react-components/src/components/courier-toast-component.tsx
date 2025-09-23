import { useRef, useEffect, forwardRef, ReactNode, useContext, CSSProperties } from "react";
import { CourierInboxTheme, CourierInboxToast as CourierInboxToastElement, CourierInboxToastItemFactoryProps, CourierInboxToastItemAddedEvent, CourierInboxToastItemDismissedEvent } from "@trycourier/courier-ui-inbox";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";
import { CourierRenderContext } from "../context/render-context";
import { CourierToastDismissButtonOption } from "@trycourier/courier-ui-inbox/dist/types/toast";

export interface CourierToastProps {
  /**
   * Styles applied to the {@link CourierToast} component.
   *
   * By default, the component has the following styles:
   *
   * ```css
   * position: 'fixed';
   * width: '380px';
   * top: '30px';
   * right: '30px';
   * z-index: 999;
   * ```
   *
   * Setting styles directly on the component is useful to customize the component's
   * position and layout. Setting `height` is effectively a no-op, as `height`
   * will be dynamically set by the component as toast items are added and removed.
   */
  style?: CSSProperties;

  /** Theme object for light mode */
  lightTheme?: CourierInboxTheme;

  /** Theme object for dark mode */
  darkTheme?: CourierInboxTheme;

  /** Theme mode: "light", "dark", or "system". Defaults to "system" */
  mode?: CourierComponentThemeMode;

  /** Enable toasts to auto-dismiss, including a timer bar at the top of the toast. Defaults to false. */
  autoDismiss?: boolean;

  /** The timeout before a toast auto-dismisses, if {@link CourierToastProps.autoDismiss} is enabled. Defaults to 5000ms. */
  autoDismissTimeoutMs?: number;

  dismissButton?: CourierToastDismissButtonOption;

  /** Callback fired when a message is clicked. */
  onToastItemClick?: (props: CourierInboxToastItemAddedEvent) => void;

  /** Callback fired when a message is clicked. */
  onToastItemDismissed?: (props: CourierInboxToastItemDismissedEvent) => void;

  /** Callback fired when a message is clicked. */
  onToastItemAdded?: (props: CourierInboxToastItemAddedEvent) => void;

  /** Allows you to pass a custom component as the list item. */
  renderToastItem?: (props: CourierInboxToastItemFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the list item. */
  renderToastItemContent?: (props: CourierInboxToastItemFactoryProps | undefined | null) => ReactNode;
}

export const CourierToastComponent = forwardRef<CourierInboxToastElement, CourierToastProps>((props, ref) => {
  const render = useContext(CourierRenderContext);
  if (!render) {
    throw new Error("RenderContext not found. Ensure CourierToast is wrapped in a CourierRenderContext.");
  }

  // Element ref for use in effects, updated by handleRef.
  const toastRef = useRef<CourierInboxToastElement | null>(null);

  // Callback ref passed to rendered component, used to propagate the DOM element's ref to the parent component.
  // We use a callback ref (rather than a React.RefObject) since we want the parent ref to be up-to-date with
  // rendered component. Updating the parent ref via useEffect does not work, since mutating a RefObject
  // does not trigger useEffect (see https://stackoverflow.com/a/60476525).
  function handleRef(el: CourierInboxToastElement | null) {
    if (ref) {

      // Propagate ref to ref callback functions
      if (typeof ref === 'function') {
        ref(el);
      } else {
        // Propagate ref to ref objects
        // @ts-ignore - RefObject.current is readonly in React 17, however it's not frozen and is equivalent the widened type MutableRefObject
        (ref as React.RefObject<CourierInboxToastElement | null>).current = el;
      }
    }

    // Store the element for use in effects
    toastRef.current = el;
  }

  // Helper to get the current element
  function getEl(): CourierInboxToastElement | null {
    return toastRef.current;
  }

  // Handle toast item clicked
  useEffect(() => {
    const toast = getEl();
    if (!toast) return;
    toast.onToastItemClicked(props.onToastItemClick);
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
      toast.setToastItem((itemProps?: CourierInboxToastItemFactoryProps | undefined | null): HTMLElement => {
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
      toast.setToastItemContent((itemProps?: CourierInboxToastItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderToastItemContent!(itemProps);
        return render(reactNode);
      });
    });
  }, [props.renderToastItemContent]);

  const children = (
    /* @ts-ignore */
    <courier-inbox-toast
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
