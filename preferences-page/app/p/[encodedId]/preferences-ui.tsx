"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CourierPreferences, useCourier } from "@trycourier/courier-react";
import type { CourierConfig } from "@/lib/types";
import { apiUrlsFromConfig } from "@/lib/config";
import { preferencesTheme } from "./theme";

const TITLE = "Notifications Preferences";
const SUBTITLE =
  "For the categories listed below, you can choose how you'd like to be reached.";

// Inline styles (not Tailwind) so this component is portable into the embed
// bundle that the backend inlines — the only page-level styling is the centered
// container; the `<CourierPreferences>` component styles itself (shadow DOM +
// `lightTheme`).
const containerStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 16px",
};
const innerStyle: CSSProperties = { width: "100%", maxWidth: 640 };

/**
 * Signs the user into Courier from a resolved {@link CourierConfig}, then renders
 * the themed `<CourierPreferences>`. Shared by the Next `/p` route
 * (`preferences-client.tsx`) and the embed bundle (`embed/main.tsx`). No Next
 * routing / `window` coupling — it only consumes the config it's handed.
 */
export function PreferencesUI({ config }: { config: CourierConfig }) {
  const courier = useCourier();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    courier.shared.signIn({
      userId: config.userId,
      jwt: config.authorization,
      apiUrls: apiUrlsFromConfig(config.apiUrl),
      ...(config.tenantId ? { tenantId: config.tenantId } : {}),
    });
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={containerStyle}
      data-preference-page-draft-mode={
        config.preferencePageDraftMode ? "true" : undefined
      }
    >
      <div style={innerStyle}>
        {ready && (
          <CourierPreferences
            mode="light"
            lightTheme={preferencesTheme}
            title={TITLE}
            subtitle={SUBTITLE}
            brandId={config.brandId || undefined}
            draft={config.preferencePageDraftMode}
          />
        )}
      </div>
    </div>
  );
}
