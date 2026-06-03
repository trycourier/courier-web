import { useRef, useEffect, forwardRef, CSSProperties } from "react";
import {
  CourierPreferencesTheme,
  CourierPreferences as CourierPreferencesElement,
} from "@trycourier/courier-ui-preferences";
import { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
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
  onError?: (error: Error) => void;
}

export const CourierPreferencesComponent = forwardRef<CourierPreferencesElement, CourierPreferencesProps>((props, ref) => {
  const elRef = useRef<CourierPreferencesElement | null>(null);

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
  }

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (props.channelLabels) {
      el.setChannelLabels(props.channelLabels);
    }
  }, [props.channelLabels]);

  // When themes change, the web component's setDarkTheme/setLightTheme only calls
  // updateTheme() when _systemMode matches — it ignores an explicit _userMode override.
  // Re-calling setMode() always triggers updateTheme(), picking up the new theme values.
  useEffect(() => {
    const el = elRef.current;
    if (!el || !props.mode) return;
    el.setMode(props.mode);
  }, [props.lightTheme, props.darkTheme, props.mode]);

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
    />
  );

  return (
    <CourierClientComponent children={children} />
  );
});

CourierPreferencesComponent.displayName = 'CourierPreferencesComponent';
