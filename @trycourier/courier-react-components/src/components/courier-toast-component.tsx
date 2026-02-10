import { useRef, useEffect, forwardRef, ReactNode, useContext, CSSProperties, useState, useCallback } from "react";
import { CourierToastTheme, CourierToast as CourierToastElement, CourierToastItemFactoryProps } from "@trycourier/courier-ui-toast";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";
import { CourierRenderContext } from "../context/render-context";
import { CourierToastDismissButtonOption, CourierToastItemClickEvent, CourierToastItemActionClickEvent } from "@trycourier/courier-ui-toast";

/** Props that may be passed to the CourierToast component. */
export interface CourierToastProps {
  /**
   * Styles applied to the CourierToast component.
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
  lightTheme?: CourierToastTheme;

  /** Theme object used to render the component when dark mode is used. */
  darkTheme?: CourierToastTheme;

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
  onToastItemClick?: (props: CourierToastItemClickEvent) => void;

  /** Callback function invoked when a toast item action button is clicked. */
  onToastItemActionClick?: (props: CourierToastItemActionClickEvent) => void;

  /**
   * Callback function invoked when the component is ready to receive messages.
   *
   * Use onReady to ensure CourierToast has applied event listeners and
   * render props passed to the component before toasts are presented.
   *
   * @example
   * ```tsx
   * const [toastReady, setToastReady] = useState(false);
   * const courier = useCourier();
   *
   * useEffect(() => {
   *   if (toastReady) {
   *     courier.shared.signIn({ userId, jwt });
   *   }
   * }, [toastReady]);
   *
   * return <CourierToast onReady={setToastReady} renderToastItem={myCustomItem} />
   * ```
   */
  onReady?: (ready: boolean) => void;

  /** Render prop specifying how to render an entire toast item. */
  renderToastItem?: (props: CourierToastItemFactoryProps) => ReactNode;

  /**
   * Render prop specifying how to render a toast item's content.
   *
   * The toast item's container, including the stack, auto-dismiss timer, and dismiss button
   * are still present when this prop is set.
   *
   * This callback is stabilized internally, so wrapping it in `useCallback` is optional.
   * Memoizing in parent components can still reduce parent re-renders.
   *
   * See {@link CourierToastProps.dismissButton} to customize the dismiss button's visibility and
   * {@link CourierToastProps.renderToastItem} to customize the entire toast item, including
   * its container.
   */
  renderToastItemContent?: (props: CourierToastItemFactoryProps) => ReactNode;
}

type SetupSteps = {
  elementMounted: boolean;
  onItemClickSet: boolean;
  onItemActionClickSet: boolean;
  renderToastItemSet: boolean;
  renderToastItemContentSet: boolean;
};

export const CourierToastComponent = forwardRef<CourierToastElement, CourierToastProps>((props, ref) => {
  const render = useContext(CourierRenderContext);
  if (!render) {
    throw new Error("RenderContext not found. Ensure CourierToast is wrapped in a CourierRenderContext.");
  }

  // Track ready state for each of the useEffects that is called for a prop set on CourierToastComponent
  // which must be translated into an imperative call on <courier-toast>.
  // When all the steps are complete, props.onReady is called to indicate the component is ready to receive toasts.
  const [setupSteps, setSetupSteps] = useState<SetupSteps>({
    elementMounted: false,
    onItemClickSet: false,
    onItemActionClickSet: false,
    renderToastItemSet: false,
    renderToastItemContentSet: false
  });
  const [elementReady, setElementReady] = useState(false);

  // Element ref for use in effects, updated by handleRef.
  const toastRef = useRef<CourierToastElement | null>(null);
  const isMountedRef = useRef(false);
  const onReadyCalledRef = useRef(false);
  const renderToastItemRef = useRef<CourierToastProps["renderToastItem"]>(props.renderToastItem);
  const renderToastItemContentRef = useRef<CourierToastProps["renderToastItemContent"]>(props.renderToastItemContent);

  if (props.renderToastItem) {
    renderToastItemRef.current = props.renderToastItem;
  }

  if (props.renderToastItemContent) {
    renderToastItemContentRef.current = props.renderToastItemContent;
  }

  const hasRenderToastItem = !!props.renderToastItem;
  const hasRenderToastItemContent = !!props.renderToastItemContent;

  const markSetupStepComplete = useCallback((step: keyof SetupSteps) => {
    setSetupSteps(prev => {
      if (prev[step]) {
        return prev;
      }

      return {
        ...prev,
        [step]: true,
      } as SetupSteps;
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

    // Update element ready state
    setElementReady(!!el);
  }

  // Helper to get the current element
  function getEl(): CourierToastElement | null {
    return toastRef.current;
  }

  // Check if all setup steps are complete and fire onReady
  useEffect(() => {
    const allStepsComplete = Object.values(setupSteps).every(step => step);
    if (allStepsComplete && props.onReady && !onReadyCalledRef.current) {
      onReadyCalledRef.current = true;
      props.onReady(true);
    }
  }, [setupSteps, props.onReady]);

  // Track when element is mounted
  useEffect(() => {
    if (elementReady) {
      markSetupStepComplete("elementMounted");
    }
  }, [elementReady, markSetupStepComplete]);

  // Handle toast item click
  useEffect(() => {
    if (!elementReady) return;
    const toast = getEl();
    if (!toast) return;
    toast.onToastItemClick(props.onToastItemClick);
    markSetupStepComplete("onItemClickSet");
  }, [props.onToastItemClick, elementReady, markSetupStepComplete]);

  // Handle toast item action click
  useEffect(() => {
    if (!elementReady) return;
    const toast = getEl();
    if (!toast) return;
    toast.onToastItemActionClick(props.onToastItemActionClick);
    markSetupStepComplete("onItemActionClickSet");
  }, [props.onToastItemActionClick, elementReady, markSetupStepComplete]);

  // Render toast item
  useEffect(() => {
    if (!elementReady) return;
    const toast = getEl();
    if (!toast) return;

    if (!hasRenderToastItem) {
      toast.setToastItem();
      markSetupStepComplete("renderToastItemSet");
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || !isMountedRef.current) {
        return;
      }

      const currentToast = getEl();
      if (!currentToast || !currentToast.isConnected) {
        return;
      }

      currentToast.setToastItem((itemProps: CourierToastItemFactoryProps): HTMLElement => {
        const renderToastItem = renderToastItemRef.current;
        if (!renderToastItem) {
          return document.createElement("div");
        }

        const reactNode = renderToastItem(itemProps);
        return render(reactNode);
      });
      markSetupStepComplete("renderToastItemSet");
    });

    return () => {
      cancelled = true;
    };
  }, [elementReady, hasRenderToastItem, markSetupStepComplete, render]);

  // Render toast item content
  useEffect(() => {
    if (!elementReady) return;
    const toast = getEl();
    if (!toast) return;

    if (!hasRenderToastItemContent) {
      toast.setToastItemContent();
      markSetupStepComplete("renderToastItemContentSet");
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || !isMountedRef.current) {
        return;
      }

      const currentToast = getEl();
      if (!currentToast || !currentToast.isConnected) {
        return;
      }

      currentToast.setToastItemContent((itemProps: CourierToastItemFactoryProps): HTMLElement => {
        const renderToastItemContent = renderToastItemContentRef.current;
        if (!renderToastItemContent) {
          return document.createElement("div");
        }

        const reactNode = renderToastItemContent(itemProps);
        return render(reactNode);
      });
      markSetupStepComplete("renderToastItemContentSet");
    });

    return () => {
      cancelled = true;
    };
  }, [elementReady, hasRenderToastItemContent, markSetupStepComplete, render]);

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
