import { useRef, useEffect, useState, forwardRef, CSSProperties } from "react";
import {
  CourierPreferencesTheme,
  CourierPreferences as CourierPreferencesElement,
} from "@trycourier/courier-ui-preferences";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { CourierPreferencePage } from "@trycourier/courier-js";
import { CourierClientComponent } from "./courier-client-component";

/** Props for the CourierPreferences React component. */
export interface CourierPreferencesProps {
  style?: CSSProperties;
  lightTheme?: CourierPreferencesTheme;
  darkTheme?: CourierPreferencesTheme;
  mode?: CourierComponentThemeMode;
  title?: string;
  subtitle?: string;
  brandId?: string;
  channelLabels?: Record<string, string>;
  /**
   * Render injected "dummy" preference data instead of fetching from the API.
   * Pass a full `CourierPreferencePage`; no sign-in / network is required.
   */
  previewData?: CourierPreferencePage;
  /**
   * Force the component's loading skeleton on/off. Useful while the host fetches
   * data it will inject via `previewData` (e.g. a brand) and wants the
   * component's own loading state shown in the meantime.
   */
  isLoading?: boolean;
  /**
   * Render the unpublished working draft instead of the published page (fetches
   * `draftPreferencePage`). Used by the hosted draft preview.
   */
  draft?: boolean;
  onError?: (error: Error) => void;
}

export const CourierPreferencesComponent = forwardRef<CourierPreferencesElement, CourierPreferencesProps>((props, ref) => {
  const elRef = useRef<CourierPreferencesElement | null>(null);
  // The element renders behind CourierClientComponent (client-only), so it can
  // mount AFTER these effects first run. Track readiness and include it in the
  // deps so imperative setters fire once the element exists.
  const [elementReady, setElementReady] = useState(false);

  function handleRef(el: CourierPreferencesElement | null) {
    if (ref) {
      if (typeof ref === 'function') {
        ref(el);
      } else {
        // @ts-ignore
        (ref as React.RefObject<CourierPreferencesElement | null>).current = el;
      }
    }
    elRef.current = el;
    setElementReady(!!el);
  }

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (props.channelLabels) {
      el.setChannelLabels(props.channelLabels);
    }
  }, [props.channelLabels, elementReady]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.setPreviewData(props.previewData ?? null);
  }, [props.previewData, elementReady]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.setLoading(Boolean(props.isLoading));
  }, [props.isLoading, elementReady]);

  // When themes change, the web component's setDarkTheme/setLightTheme only calls
  // updateTheme() when _systemMode matches — it ignores an explicit _userMode override.
  // Re-calling setMode() always triggers updateTheme(), picking up the new theme values.
  useEffect(() => {
    const el = elRef.current;
    if (!el || !props.mode) return;
    el.setMode(props.mode);
  }, [props.lightTheme, props.darkTheme, props.mode, elementReady]);

  const children = (
    /* @ts-ignore */
    <courier-preferences
      ref={handleRef}
      style={props.style}
      light-theme={props.lightTheme ? JSON.stringify(props.lightTheme) : undefined}
      dark-theme={props.darkTheme ? JSON.stringify(props.darkTheme) : undefined}
      mode={props.mode}
      title={props.title}
      subtitle={props.subtitle}
      brand-id={props.brandId}
      preview={props.previewData ? "true" : undefined}
      draft={props.draft ? "true" : undefined}
    />
  );

  return (
    <CourierClientComponent children={children} />
  );
});

CourierPreferencesComponent.displayName = 'CourierPreferencesComponent';
