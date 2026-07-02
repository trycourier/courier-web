import { defineComponent, h, ref, watch, type PropType, type StyleValue } from "vue";
import {
  CourierPreferences as CourierPreferencesElement,
  type CourierPreferencesTheme,
} from "@trycourier/courier-ui-preferences";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { jsonAttr, onElementReady } from "../utils/bindings";

/**
 * CourierPreferences Vue component — renders the user's notification
 * preferences and lets them update topic/channel routing.
 */
export const CourierPreferences = defineComponent({
  name: "CourierPreferences",
  props: {
    /** Inline styles applied to the component. */
    style: { type: [String, Object, Array] as PropType<StyleValue>, default: undefined },
    /** Theme object for light mode. */
    lightTheme: { type: Object as PropType<CourierPreferencesTheme>, default: undefined },
    /** Theme object for dark mode. */
    darkTheme: { type: Object as PropType<CourierPreferencesTheme>, default: undefined },
    /** Theme mode: "light", "dark", or "system". Defaults to "system". */
    mode: { type: String as PropType<CourierComponentThemeMode>, default: undefined },
    /** Title displayed above the preferences. */
    title: { type: String, default: undefined },
    /** Subtitle displayed below the title. */
    subtitle: { type: String, default: undefined },
    /** Brand id used to theme the preferences. */
    brandId: { type: String, default: undefined },
    /**
     * Scope preferences to a specific tenant/account. Overrides the tenant set
     * at `signIn` for this component only. Falls back to the client's `tenantId`.
     */
    tenantId: { type: String, default: undefined },
    /** Map of channel keys to display labels. */
    channelLabels: { type: Object as PropType<Record<string, string>>, default: undefined },
    /** Callback invoked when the component encounters an error. */
    onError: { type: Function as PropType<(error: Error) => void>, default: undefined },
  },
  setup(props, { expose }) {
    const elRef = ref<CourierPreferencesElement | null>(null);

    expose({ getElement: () => elRef.value });

    onElementReady(elRef, (el) => {
      watch(
        () => props.channelLabels,
        (labels) => {
          if (labels) {
            el.setChannelLabels(labels);
          }
        },
        { immediate: true }
      );

      // When themes change, the web component's setDarkTheme/setLightTheme only
      // calls updateTheme() when _systemMode matches — it ignores an explicit
      // _userMode override. Re-calling setMode() always triggers updateTheme(),
      // picking up the new theme values.
      watch(
        () => [props.lightTheme, props.darkTheme, props.mode],
        () => {
          if (props.mode) {
            el.setMode(props.mode);
          }
        }
      );
    });

    return () =>
      h("courier-preferences", {
        ref: elRef,
        style: props.style,
        "light-theme": jsonAttr(props.lightTheme),
        "dark-theme": jsonAttr(props.darkTheme),
        mode: props.mode,
        title: props.title,
        subtitle: props.subtitle,
        "brand-id": props.brandId,
        "tenant-id": props.tenantId,
      });
  },
});

export default CourierPreferences;
