import { useRef, useEffect, forwardRef, ReactNode, useContext } from "react";
import { CourierInboxTheme, CourierInboxToast as CourierInboxToastElement, CourierInboxToastItemFactoryProps, CourierInboxToastItemAddedEvent, CourierInboxToastItemDismissedEvent } from "@trycourier/courier-ui-inbox";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierClientComponent } from "./courier-client-component";
import { CourierRenderContext } from "../context/render-context";

export interface CourierToastProps {
  /** Height of the toast container. Defaults to "auto" and will resize itself based on it's children. */
  height?: string;

  width?: string;

  top?: string;

  right?: string;

  /** Theme object for light mode */
  lightTheme?: CourierInboxTheme;

  /** Theme object for dark mode */
  darkTheme?: CourierInboxTheme;

  /** Theme mode: "light", "dark", or "system". Defaults to "system" */
  mode?: CourierComponentThemeMode;

  autoDismiss?: boolean;

  autoDismissTimeoutMs?: number;

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
  const inboxRef = useRef<CourierInboxToastElement | null>(null);

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
        (ref as React.RefObject<CourierInboxElement | null>).current = el;
      }
    }

    // Store the element for use in effects
    inboxRef.current = el;
  }

  // Helper to get the current element
  function getEl(): CourierInboxToastElement | null {
    return inboxRef.current;
  }

  // Handle toast item clicked
  useEffect(() => {
    const inbox = getEl();
    if (!inbox) return;
    inbox.onToastItemClicked(props.onToastItemClick);
  }, [props.onToastItemClick]);

  // Handle toast item dismissed
  useEffect(() => {
    const inbox = getEl();
    if (!inbox) return;
    inbox.onToastItemDismissed(props.onToastItemDismissed);
  }, [props.onToastItemDismissed]);

  // Handle toast item added
  useEffect(() => {
    const inbox = getEl();
    if (!inbox) return;
    inbox.onToastItemAdded(props.onToastItemAdded);
  }, [props.onToastItemAdded]);

  // Render toast item
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderToastItem) return;
    queueMicrotask(() => {
      inbox.setToastItem((itemProps?: CourierInboxToastItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderToastItem!(itemProps);
        return render(reactNode);
      });
    });
  }, [props.renderToastItem]);

  // Render toast item content
  useEffect(() => {
    const inbox = getEl();
    if (!inbox || !props.renderToastItemContent) return;
    queueMicrotask(() => {
      inbox.setToastItemContent((itemProps?: CourierInboxToastItemFactoryProps | undefined | null): HTMLElement => {
        const reactNode = props.renderToastItemContent!(itemProps);
        return render(reactNode);
      });
    });
  }, [props.renderToastItemContent]);

  const children = (
    /* @ts-ignore */
    <courier-inbox-toast
      ref={handleRef}
      height={props.height}
      width={props.width}
      top={props.top}
      right={props.right}
      light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
      dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
      mode={props.mode}
      auto-dismiss={props.autoDismiss}
      auto-dismiss-timeout-ms={props.autoDismissTimeoutMs}
    />
  );

  return (
    <CourierClientComponent children={children} />
  );
});
