import { SystemThemeMode } from "@trycourier/courier-ui-core";
import { defaultDarkTheme } from "../types/courier-inbox-theme";
import { defaultLightTheme } from "../types/courier-inbox-theme";

export function getFallbackTheme(theme: SystemThemeMode) {
  switch (theme) {
    case 'light':
      return defaultLightTheme;
    case 'dark':
      return defaultDarkTheme;
  }
}
