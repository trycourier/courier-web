import { useEffect, useRef, forwardRef, ReactNode, useContext, useState } from 'react';
import {
  CourierInboxFeedType,
  CourierInboxHeaderFactoryProps,
  CourierInboxListItemActionFactoryProps,
  CourierInboxListItemFactoryProps,
  CourierInboxMenuButtonFactoryProps,
  CourierInboxPopupMenu as CourierInboxPopupMenuElement,
  CourierInboxPaginationItemFactoryProps,
  CourierInboxPopupAlignment,
  CourierInboxStateEmptyFactoryProps,
  CourierInboxStateErrorFactoryProps,
  CourierInboxStateLoadingFactoryProps,
  CourierInboxTheme,
} from '@trycourier/courier-ui-inbox';
import { CourierComponentThemeMode } from '@trycourier/courier-ui-core';
import { CourierClientComponent } from './courier-client-component';
import { CourierRenderContext } from '../context/render-context';

export interface CourierInboxPopupMenuProps {
  /** Alignment of the popup menu: 'top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center', 'center-right', 'center-left', 'center-center'. */
  popupAlignment?: CourierInboxPopupAlignment;

  /** Width of the popup menu container. */
  popupWidth?: string;

  /** Height of the popup menu container. */
  popupHeight?: string;

  /** CSS left position for the popup menu. */
  left?: string;

  /** CSS top position for the popup menu. */
  top?: string;

  /** CSS right position for the popup menu. */
  right?: string;

  /** CSS bottom position for the popup menu. */
  bottom?: string;

  /** Theme object for light mode. */
  lightTheme?: CourierInboxTheme;

  /** Theme object for dark mode. */
  darkTheme?: CourierInboxTheme;

  /** Theme mode: 'light', 'dark', or 'system'. */
  mode?: CourierComponentThemeMode;

  /** Type of feed to display in the popup menu ('inbox' or 'archive'). */
  feedType?: CourierInboxFeedType;

  /** Callback fired when a message is clicked. */
  onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;

  /** Callback fired when a message action (e.g., button) is clicked. */
  onMessageActionClick?: (props: CourierInboxListItemActionFactoryProps) => void;

  /** Callback fired when a message is long-pressed (for mobile/gesture support). */
  onMessageLongPress?: (props: CourierInboxListItemFactoryProps) => void;

  /** Allows you to pass a custom component as the header. */
  renderHeader?: (props: CourierInboxHeaderFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the list item. */
  renderListItem?: (props: CourierInboxListItemFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the empty state. */
  renderEmptyState?: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the loading state. */
  renderLoadingState?: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the error state. */
  renderErrorState?: (props: CourierInboxStateErrorFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the pagination list item. */
  renderPaginationItem?: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => ReactNode;

  /** Allows you to pass a custom component as the menu button. */
  renderMenuButton?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => ReactNode;
}

export const CourierInboxPopupMenuComponent = forwardRef<CourierInboxPopupMenuElement, CourierInboxPopupMenuProps>(
  (props, ref) => {
    const render = useContext(CourierRenderContext);
    if (!render) {
      throw new Error("RenderContext not found. Ensure CourierInboxPopupMenu is wrapped in a CourierRenderContext.");
    }

    // Element ref for use in effects, updated by handleRef.
    const inboxRef = useRef<CourierInboxPopupMenuElement | null>(null);
    const [elementReady, setElementReady] = useState(false);

    // Callback ref passed to rendered component, used to propagate the DOM element's ref to the parent component.
    // We use a callback ref (rather than a React.RefObject) since we want the parent ref to be up-to-date with
    // rendered component. Updating the parent ref via useEffect does not work, since mutating a RefObject
    // does not trigger useEffect (see https://stackoverflow.com/a/60476525).
    function handleRef(el: CourierInboxPopupMenuElement | null) {
      if (ref) {
        if (typeof ref === 'function') {
          ref(el);
        } else {
          // @ts-ignore - RefObject.current is readonly in React 17, however it's not frozen and is equivalent the widened type MutableRefObject
          (ref as React.RefObject<CourierInboxPopupMenuElement | null>).current = el;
        }
      }

      // Store the element for use in effects
      inboxRef.current = el;

      // Update element ready state
      setElementReady(!!el);
    }

    // Helper to get the current element
    function getEl(): CourierInboxPopupMenuElement | null {
      return inboxRef.current;
    }

    // Use a ref to track the last set feedType to prevent duplicate state changes
    const lastFeedTypeRef = useRef<CourierInboxFeedType | undefined>(undefined);

    useEffect(() => {
      const menu = getEl();
      if (!menu) return;
      // Only set feedType if it has changed from the last set value
      if (props.feedType !== lastFeedTypeRef.current) {
        lastFeedTypeRef.current = props.feedType;
        queueMicrotask(() => {
          menu.setFeedType?.(props.feedType ?? 'inbox');
        });
      }
    }, [props.feedType, elementReady]);

    // Handle message click
    useEffect(() => {
      const menu = getEl();
      if (!menu) return;
      menu.onMessageClick(props.onMessageClick);
    }, [props.onMessageClick, elementReady]);

    // Handle message action click
    useEffect(() => {
      const menu = getEl();
      if (!menu) return;
      menu.onMessageActionClick(props.onMessageActionClick);
    }, [props.onMessageActionClick, elementReady]);

    // Handle message long press
    useEffect(() => {
      const menu = getEl();
      if (!menu) return;
      menu.onMessageLongPress(props.onMessageLongPress);
    }, [props.onMessageLongPress, elementReady]);

    // Render header
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderHeader) return;
      queueMicrotask(() => {
        menu.setHeader((headerProps?: CourierInboxHeaderFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderHeader!(headerProps);
          return render(reactNode);
        });
      });
    }, [props.renderHeader, elementReady]);

    // Render list item
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderListItem) return;
      queueMicrotask(() => {
        menu.setListItem((itemProps?: CourierInboxListItemFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderListItem!(itemProps);
          return render(reactNode);
        });
      });
    }, [props.renderListItem, elementReady]);

    // Render empty state
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderEmptyState) return;
      queueMicrotask(() => {
        menu.setEmptyState((emptyStateProps?: CourierInboxStateEmptyFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderEmptyState!(emptyStateProps);
          return render(reactNode);
        });
      });
    }, [props.renderEmptyState, elementReady]);

    // Render loading state
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderLoadingState) return;
      queueMicrotask(() => {
        menu.setLoadingState((loadingStateProps?: CourierInboxStateLoadingFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderLoadingState!(loadingStateProps);
          return render(reactNode);
        });
      });
    }, [props.renderLoadingState, elementReady]);

    // Render error state
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderErrorState) return;
      queueMicrotask(() => {
        menu.setErrorState((errorStateProps?: CourierInboxStateErrorFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderErrorState!(errorStateProps);
          return render(reactNode);
        });
      });
    }, [props.renderErrorState, elementReady]);

    // Render pagination item
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderPaginationItem) return;
      queueMicrotask(() => {
        menu.setPaginationItem((paginationProps?: CourierInboxPaginationItemFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderPaginationItem!(paginationProps);
          return render(reactNode);
        });
      });
    }, [props.renderPaginationItem, elementReady]);

    // Render menu button
    useEffect(() => {
      const menu = getEl();
      if (!menu || !props.renderMenuButton) return;
      queueMicrotask(() => {
        menu.setMenuButton((buttonProps?: CourierInboxMenuButtonFactoryProps | undefined | null): HTMLElement => {
          const reactNode = props.renderMenuButton!(buttonProps);
          return render(reactNode);
        });
      });
    }, [props.renderMenuButton, elementReady]);

    const children = (
      /* @ts-ignore */
      <courier-inbox-popup-menu
        ref={handleRef}
        popup-alignment={props.popupAlignment}
        popup-width={props.popupWidth}
        popup-height={props.popupHeight}
        left={props.left}
        top={props.top}
        right={props.right}
        bottom={props.bottom}
        light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
        dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
        mode={props.mode}
      />
    );

    return (
      <CourierClientComponent children={children} />
    );
  }
);
