import { defineComponent, h, ref, type PropType, type VNodeChild } from "vue";
import {
  CourierInbox as CourierInboxElement,
  type CourierInboxFeed,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxListItemActionFactoryProps,
  type CourierInboxListItemFactoryProps,
  type CourierInboxPaginationItemFactoryProps,
  type CourierInboxStateEmptyFactoryProps,
  type CourierInboxStateErrorFactoryProps,
  type CourierInboxStateLoadingFactoryProps,
  type CourierInboxTheme,
} from "@trycourier/courier-ui-inbox";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { bindCallback, bindRenderSlot, jsonAttr, onElementReady } from "../utils/bindings";

/**
 * CourierInbox Vue component.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { onMounted } from 'vue';
 * import { CourierInbox, useCourier } from '@trycourier/courier-vue';
 *
 * const courier = useCourier();
 *
 * onMounted(() => {
 *   // Generate a JWT for your user (do this on your backend server)
 *   courier.auth.value.signIn({ userId: 'YOUR_USER_ID', jwt: 'YOUR_JWT' });
 * });
 * </script>
 *
 * <template>
 *   <CourierInbox />
 * </template>
 * ```
 */
export const CourierInbox = defineComponent({
  name: "CourierInbox",
  props: {
    /** Height of the inbox container. Defaults to "auto" and will resize itself based on its children. */
    height: { type: String, default: undefined },
    /** Theme object for light mode. */
    lightTheme: { type: Object as PropType<CourierInboxTheme>, default: undefined },
    /** Theme object for dark mode. */
    darkTheme: { type: Object as PropType<CourierInboxTheme>, default: undefined },
    /** Theme mode: "light", "dark", or "system". Defaults to "system". */
    mode: { type: String as PropType<CourierComponentThemeMode>, default: undefined },
    /** Type of feed to display in the inbox. Defaults to "inbox". */
    feedType: { type: String, default: undefined },
    /** Array of feeds to display in the inbox. Each feed contains tabs with different filters. */
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
    /** Callback fired when a message is long-pressed (touch devices only). */
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
  },
  setup(props, { expose }) {
    const elRef = ref<CourierInboxElement | null>(null);

    expose({ getElement: () => elRef.value });

    onElementReady(elRef, (el) => {
      // Events — re-register whenever the handler prop identity changes.
      bindCallback(() => props.onMessageClick, (cb) => el.onMessageClick(cb));
      bindCallback(() => props.onMessageActionClick, (cb) => el.onMessageActionClick(cb));
      bindCallback(() => props.onMessageLongPress, (cb) => el.onMessageLongPress(cb));

      // Custom render slots.
      bindRenderSlot(() => props.renderHeader, (factory) => el.setHeader(factory));
      bindRenderSlot(() => props.renderListItem, (factory) => el.setListItem(factory));
      bindRenderSlot(() => props.renderEmptyState, (factory) => el.setEmptyState(factory));
      bindRenderSlot(() => props.renderLoadingState, (factory) => el.setLoadingState(factory));
      bindRenderSlot(() => props.renderErrorState, (factory) => el.setErrorState(factory));
      bindRenderSlot(() => props.renderPaginationItem, (factory) => el.setPaginationItem(factory));
    });

    // Attributes are bound reactively in the render function; the web component
    // observes them and updates itself.
    return () =>
      h("courier-inbox", {
        ref: elRef,
        height: props.height,
        "light-theme": jsonAttr(props.lightTheme),
        "dark-theme": jsonAttr(props.darkTheme),
        mode: props.mode,
        feeds: jsonAttr(props.feeds),
      });
  },
});

export default CourierInbox;
