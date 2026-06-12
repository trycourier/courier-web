import { useRef, useEffect, forwardRef, ReactNode, useContext, CSSProperties, useState, useCallback } from "react";
import { CourierBannerTheme, CourierBanner as CourierBannerElement, CourierBannerItemFactoryProps, CourierBannerLayout, CourierBannerPosition } from "@trycourier/courier-ui-banner";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";
import { CourierRenderContext } from "../context/render-context";
import { CourierBannerDismissButtonOption, CourierBannerItemClickEvent, CourierBannerItemActionClickEvent } from "@trycourier/courier-ui-banner";

/** Props that may be passed to the CourierBanner component. */
export interface CourierBannerProps {
  /**
   * Styles applied to the CourierBanner component.
   *
   * With the default `banner` layout the element renders inline at its location in the DOM,
   * so styles here control its placement (e.g. sticking it to the top of the page). The
   * `popup` layout renders a fixed overlay regardless of these styles.
   */
  style?: CSSProperties;

  /**
   * How the banner is presented: `banner` (inline strip, default), `popup` (overlay card),
   * or `custom` (consumer-rendered; theme not applied).
   */
  layout?: CourierBannerLayout;

  /** Anchor position for the `popup` layout. Defaults to "center". */
  position?: CourierBannerPosition;

  /** Whether banners can be dismissed by the user. Defaults to true. */
  dismissible?: boolean;

  /**
   * Whether the banner requires an action click to dismiss. With the `popup` layout this
   * also disables backdrop-click-to-close. Useful for "Accept"-gated flows. Defaults to false.
   */
  requireAction?: boolean;

  /** Maximum number of banners visible at once; additional messages queue FIFO. Defaults to 1. */
  maxVisible?: number;

  /** Theme object used to render the component when light mode is used. */
  lightTheme?: CourierBannerTheme;

  /** Theme object used to render the component when dark mode is used. */
  darkTheme?: CourierBannerTheme;

  /** Manually set the theme mode to one of "light", "dark", or "system". Defaults to "system". */
  mode?: CourierComponentThemeMode;

  /** Enable banners to auto-dismiss, including a timer bar at the top of the banner. Defaults to false. */
  autoDismiss?: boolean;

  /**
   * The timeout before a banner auto-dismisses, if {@link CourierBannerProps.autoDismiss} is enabled.
   * Defaults to 5000ms.
   */
  autoDismissTimeoutMs?: number;

  /**
   * Set the dismiss button's visibility.
   *
   * Defaults to "auto", which makes the button always visible if `autoDismiss` is false
   * and visible on hover if `autoDismiss` is true.
   */
  dismissButton?: CourierBannerDismissButtonOption;

  /** Callback function invoked when a banner item is clicked. */
  onBannerItemClick?: (props: CourierBannerItemClickEvent) => void;

  /** Callback function invoked when a banner item action button is clicked. */
  onBannerItemActionClick?: (props: CourierBannerItemActionClickEvent) => void;

  /**
   * Callback function invoked when the component is ready to receive messages.
   *
   * Use onReady to ensure CourierBanner has applied event listeners and
   * render props passed to the component before banners are presented.
   *
   * @example
   * ```tsx
   * const [bannerReady, setBannerReady] = useState(false);
   * const courier = useCourier();
   *
   * useEffect(() => {
   *   if (bannerReady) {
   *     courier.shared.signIn({ userId, jwt });
   *   }
   * }, [bannerReady]);
   *
   * return <CourierBanner onReady={setBannerReady} renderBannerItem={myCustomItem} />
   * ```
   */
  onReady?: (ready: boolean) => void;

  /** Render prop specifying how to render an entire banner item. */
  renderBannerItem?: (props: CourierBannerItemFactoryProps) => ReactNode;

  /**
   * Render prop specifying how to render a banner item's content.
   *
   * The banner item's container, including the stack, auto-dismiss timer, and dismiss button
   * are still present when this prop is set.
   *
   * This callback is stabilized internally, so wrapping it in `useCallback` is optional.
   * Memoizing in parent components can still reduce parent re-renders.
   *
   * See {@link CourierBannerProps.dismissButton} to customize the dismiss button's visibility and
   * {@link CourierBannerProps.renderBannerItem} to customize the entire banner item, including
   * its container.
   */
  renderBannerItemContent?: (props: CourierBannerItemFactoryProps) => ReactNode;
}

type SetupSteps = {
  elementMounted: boolean;
  onItemClickSet: boolean;
  onItemActionClickSet: boolean;
  renderBannerItemSet: boolean;
  renderBannerItemContentSet: boolean;
};

export const CourierBannerComponent = forwardRef<CourierBannerElement, CourierBannerProps>((props, ref) => {
  const render = useContext(CourierRenderContext);
  if (!render) {
    throw new Error("RenderContext not found. Ensure CourierBanner is wrapped in a CourierRenderContext.");
  }

  // Track ready state for each of the useEffects that is called for a prop set on CourierBannerComponent
  // which must be translated into an imperative call on <courier-banner>.
  // When all the steps are complete, props.onReady is called to indicate the component is ready to receive banners.
  const [setupSteps, setSetupSteps] = useState<SetupSteps>({
    elementMounted: false,
    onItemClickSet: false,
    onItemActionClickSet: false,
    renderBannerItemSet: false,
    renderBannerItemContentSet: false
  });
  const [elementReady, setElementReady] = useState(false);

  // Element ref for use in effects, updated by handleRef.
  const bannerRef = useRef<CourierBannerElement | null>(null);
  const isMountedRef = useRef(false);
  const onReadyCalledRef = useRef(false);
  const renderBannerItemRef = useRef<CourierBannerProps["renderBannerItem"]>(props.renderBannerItem);
  const renderBannerItemContentRef = useRef<CourierBannerProps["renderBannerItemContent"]>(props.renderBannerItemContent);

  if (props.renderBannerItem) {
    renderBannerItemRef.current = props.renderBannerItem;
  }

  if (props.renderBannerItemContent) {
    renderBannerItemContentRef.current = props.renderBannerItemContent;
  }

  const hasRenderBannerItem = !!props.renderBannerItem;
  const hasRenderBannerItemContent = !!props.renderBannerItemContent;

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
  function handleRef(el: CourierBannerElement | null) {
    if (ref) {

      // Propagate ref to ref callback functions
      if (typeof ref === 'function') {
        ref(el);
      } else {
        // Propagate ref to ref objects
        // @ts-ignore - RefObject.current is readonly in React 17, however it's not frozen and is equivalent the widened type MutableRefObject
        (ref as React.RefObject<CourierBannerElement | null>).current = el;
      }
    }

    // Store the element for use in effects
    bannerRef.current = el;

    // Update element ready state
    setElementReady(!!el);
  }

  // Helper to get the current element
  function getEl(): CourierBannerElement | null {
    return bannerRef.current;
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

  // Handle banner item click
  useEffect(() => {
    if (!elementReady) return;
    const banner = getEl();
    if (!banner) return;
    banner.onBannerItemClick(props.onBannerItemClick);
    markSetupStepComplete("onItemClickSet");
  }, [props.onBannerItemClick, elementReady, markSetupStepComplete]);

  // Handle banner item action click
  useEffect(() => {
    if (!elementReady) return;
    const banner = getEl();
    if (!banner) return;
    banner.onBannerItemActionClick(props.onBannerItemActionClick);
    markSetupStepComplete("onItemActionClickSet");
  }, [props.onBannerItemActionClick, elementReady, markSetupStepComplete]);

  // Render banner item
  useEffect(() => {
    if (!elementReady) return;
    const banner = getEl();
    if (!banner) return;

    if (!hasRenderBannerItem) {
      banner.setBannerItem();
      markSetupStepComplete("renderBannerItemSet");
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || !isMountedRef.current) {
        return;
      }

      const currentBanner = getEl();
      if (!currentBanner || !currentBanner.isConnected) {
        return;
      }

      currentBanner.setBannerItem((itemProps: CourierBannerItemFactoryProps): HTMLElement => {
        const renderBannerItem = renderBannerItemRef.current;
        if (!renderBannerItem) {
          return document.createElement("div");
        }

        const reactNode = renderBannerItem(itemProps);
        return render(reactNode);
      });
      markSetupStepComplete("renderBannerItemSet");
    });

    return () => {
      cancelled = true;
    };
  }, [elementReady, hasRenderBannerItem, markSetupStepComplete, render]);

  // Render banner item content
  useEffect(() => {
    if (!elementReady) return;
    const banner = getEl();
    if (!banner) return;

    if (!hasRenderBannerItemContent) {
      banner.setBannerItemContent();
      markSetupStepComplete("renderBannerItemContentSet");
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || !isMountedRef.current) {
        return;
      }

      const currentBanner = getEl();
      if (!currentBanner || !currentBanner.isConnected) {
        return;
      }

      currentBanner.setBannerItemContent((itemProps: CourierBannerItemFactoryProps): HTMLElement => {
        const renderBannerItemContent = renderBannerItemContentRef.current;
        if (!renderBannerItemContent) {
          return document.createElement("div");
        }

        const reactNode = renderBannerItemContent(itemProps);
        return render(reactNode);
      });
      markSetupStepComplete("renderBannerItemContentSet");
    });

    return () => {
      cancelled = true;
    };
  }, [elementReady, hasRenderBannerItemContent, markSetupStepComplete, render]);

  const children = (
    /* @ts-ignore */
    <courier-banner
      ref={handleRef}
      style={props.style}
      layout={props.layout}
      position={props.position}
      dismissible={props.dismissible === undefined ? undefined : String(props.dismissible)}
      require-action={props.requireAction === undefined ? undefined : String(props.requireAction)}
      max-visible={props.maxVisible === undefined ? undefined : String(props.maxVisible)}
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
