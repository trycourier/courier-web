import { defineComponent, h, ref, type PropType, type VNodeChild } from "vue";
import {
  CourierInboxPopupMenu as CourierInboxPopupMenuElement,
  type CourierInboxFeed,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxListItemActionFactoryProps,
  type CourierInboxListItemFactoryProps,
  type CourierInboxMenuButtonFactoryProps,
  type CourierInboxPaginationItemFactoryProps,
  type CourierInboxPopupAlignment,
  type CourierInboxStateEmptyFactoryProps,
  type CourierInboxStateErrorFactoryProps,
  type CourierInboxStateLoadingFactoryProps,
  type CourierInboxTheme,
} from "@trycourier/courier-ui-inbox";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { bindCallback, bindRenderSlot, jsonAttr, onElementReady } from "../utils/bindings";

/**
 * CourierInboxPopupMenu Vue component — renders the inbox as a popup menu
 * anchored to a toggle button.
 */
export const CourierInboxPopupMenu = defineComponent({
  name: "CourierInboxPopupMenu",
  props: {
    /** Alignment of the popup menu relative to its anchor. */
    popupAlignment: { type: String as PropType<CourierInboxPopupAlignment>, default: undefined },
    /** Width of the popup menu container. */
    popupWidth: { type: String, default: undefined },
    /** Height of the popup menu container. */
    popupHeight: { type: String, default: undefined },
    /** CSS left position for the popup menu. */
    left: { type: String, default: undefined },
    /** CSS top position for the popup menu. */
    top: { type: String, default: undefined },
    /** CSS right position for the popup menu. */
    right: { type: String, default: undefined },
    /** CSS bottom position for the popup menu. */
    bottom: { type: String, default: undefined },
    /** Theme object for light mode. */
    lightTheme: { type: Object as PropType<CourierInboxTheme>, default: undefined },
    /** Theme object for dark mode. */
    darkTheme: { type: Object as PropType<CourierInboxTheme>, default: undefined },
    /** Theme mode: "light", "dark", or "system". */
    mode: { type: String as PropType<CourierComponentThemeMode>, default: undefined },
    /** Array of feeds to display in the inbox. */
    feeds: { type: Array as PropType<CourierInboxFeed[]>, default: undefined },
    /** Callback fired when a message is clicked. */
    onMessageClick: {
      type: Function as PropType<(props: CourierInboxListItemFactoryProps) => void>,
      default: undefined,
    },
    /** Callback fired when a message action (e.g., button) is clicked. */
    onMessageActionClick: {
      type: Function as PropType<(props: CourierInboxListItemActionFactoryProps) => void>,
      default: undefined,
    },
    /** Callback fired when a message is long-pressed. */
    onMessageLongPress: {
      type: Function as PropType<(props: CourierInboxListItemFactoryProps) => void>,
      default: undefined,
    },
    /** Render prop for a custom header. */
    renderHeader: {
      type: Function as PropType<(props: CourierInboxHeaderFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for a custom list item. */
    renderListItem: {
      type: Function as PropType<(props: CourierInboxListItemFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for a custom empty state. */
    renderEmptyState: {
      type: Function as PropType<(props: CourierInboxStateEmptyFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for a custom loading state. */
    renderLoadingState: {
      type: Function as PropType<(props: CourierInboxStateLoadingFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for a custom error state. */
    renderErrorState: {
      type: Function as PropType<(props: CourierInboxStateErrorFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for a custom pagination list item. */
    renderPaginationItem: {
      type: Function as PropType<(props: CourierInboxPaginationItemFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
    /** Render prop for the menu toggle button. */
    renderMenuButton: {
      type: Function as PropType<(props: CourierInboxMenuButtonFactoryProps | undefined | null) => VNodeChild>,
      default: undefined,
    },
  },
  setup(props, { expose }) {
    const elRef = ref<CourierInboxPopupMenuElement | null>(null);

    expose({ getElement: () => elRef.value });

    onElementReady(elRef, (el) => {
      bindCallback(() => props.onMessageClick, (cb) => el.onMessageClick(cb));
      bindCallback(() => props.onMessageActionClick, (cb) => el.onMessageActionClick(cb));
      bindCallback(() => props.onMessageLongPress, (cb) => el.onMessageLongPress(cb));

      bindRenderSlot(() => props.renderHeader, (factory) => el.setHeader(factory));
      bindRenderSlot(() => props.renderListItem, (factory) => el.setListItem(factory));
      bindRenderSlot(() => props.renderEmptyState, (factory) => el.setEmptyState(factory));
      bindRenderSlot(() => props.renderLoadingState, (factory) => el.setLoadingState(factory));
      bindRenderSlot(() => props.renderErrorState, (factory) => el.setErrorState(factory));
      bindRenderSlot(() => props.renderPaginationItem, (factory) => el.setPaginationItem(factory));
      bindRenderSlot(() => props.renderMenuButton, (factory) => el.setMenuButton(factory));
    });

    return () =>
      h("courier-inbox-popup-menu", {
        ref: elRef,
        "popup-alignment": props.popupAlignment,
        "popup-width": props.popupWidth,
        "popup-height": props.popupHeight,
        left: props.left,
        top: props.top,
        right: props.right,
        bottom: props.bottom,
        "light-theme": jsonAttr(props.lightTheme),
        "dark-theme": jsonAttr(props.darkTheme),
        mode: props.mode,
        feeds: jsonAttr(props.feeds),
      });
  },
});

export default CourierInboxPopupMenu;
