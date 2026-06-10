import type { CourierPreferencesTheme } from "@trycourier/courier-react";

/**
 * Reproduces the hand-built hosted preferences page styling (see
 * `app/globals.css` `@theme`) as a CourierPreferencesTheme so the real
 * `<CourierPreferences>` component matches the previous look.
 *
 * globals.css palette:
 *   --color-primary:   #10B981
 *   --color-body-text: #171717
 *   --color-subtitle:  #404040
 *   --color-muted:     #737373
 *   --font-sans:       "TWK Lausanne"   (all text)
 *   --font-heading:    "Inter"          (subtitle only)
 */
const BODY_FONT = '"TWK Lausanne", system-ui, -apple-system, sans-serif';
// Concrete stack (not the Next `--font-heading` CSS var) so the theme is portable
// into the embed bundle, where that var isn't defined.
const SUBTITLE_FONT = '"Inter", system-ui, -apple-system, sans-serif';

const PRIMARY = "#10B981";
const BODY_TEXT = "#171717";
const SUBTITLE = "#404040";
const MUTED = "#737373";

export const preferencesTheme: CourierPreferencesTheme = {
  primaryColor: PRIMARY,
  title: {
    family: BODY_FONT,
    size: "28px",
    weight: "500",
    color: BODY_TEXT,
  },
  subtitle: {
    family: SUBTITLE_FONT,
    size: "14px",
    weight: "400",
    color: SUBTITLE,
  },
  container: {
    font: {
      family: BODY_FONT,
      color: BODY_TEXT,
    },
  },
  section: {
    title: {
      family: BODY_FONT,
      size: "18px",
      weight: "600",
      color: BODY_TEXT,
    },
    backgroundColor: "transparent",
  },
  topic: {
    backgroundColor: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    title: {
      family: BODY_FONT,
      size: "16px",
      weight: "400",
      color: BODY_TEXT,
    },
    statusLabel: {
      family: BODY_FONT,
      size: "14px",
      weight: "300",
      color: MUTED,
    },
    toggle: {
      trackColor: "#D4D4D4",
      trackActiveColor: PRIMARY,
      thumbColor: "#FFFFFF",
      borderRadius: "12px",
    },
  },
  digest: {
    font: {
      family: BODY_FONT,
      size: "14px",
      weight: "400",
      color: "#525252",
    },
    selectedFont: {
      family: BODY_FONT,
      size: "14px",
      weight: "400",
      color: BODY_TEXT,
    },
    iconColor: "#525252",
    radio: {
      ringColor: "#D4D4D4",
      checkedColor: "#0A0A0A",
    },
  },
  channelChip: {
    font: {
      family: BODY_FONT,
      size: "14px",
      weight: "400",
      color: "#525252",
    },
    selectedFont: {
      family: BODY_FONT,
      size: "14px",
      weight: "400",
      color: BODY_TEXT,
    },
    divider: "1px solid #E5E5E5",
    checkbox: {
      checkedColor: "#0A0A0A",
    },
  },
};
