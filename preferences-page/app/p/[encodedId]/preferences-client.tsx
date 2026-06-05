"use client";

import { useEffect, useState } from "react";
import {
  CourierPreferences,
  useCourier,
  type CourierApiUrls,
} from "@trycourier/courier-react";
import { preferencesTheme } from "./theme";

interface PreferencesClientProps {
  userId: string;
  jwt: string;
  apiUrls: CourierApiUrls;
  /** Courier account / tenant id (optional). Supplied via signIn, not the component. */
  tenantId?: string;
  /** Brand to render the preference page for (optional). */
  brandId?: string;
}

const TITLE = "Notifications Preferences";
const SUBTITLE =
  "For the categories listed below, you can choose how you'd like to be reached.";

/**
 * Signs the user into Courier (so the `<courier-preferences>` web component can
 * read `Courier.shared.client`) and renders the real CourierPreferences
 * component, themed to match the legacy hosted page.
 */
export function PreferencesClient({
  userId,
  jwt,
  apiUrls,
  tenantId,
  brandId,
}: PreferencesClientProps) {
  const courier = useCourier();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    courier.shared.signIn({
      userId,
      jwt,
      apiUrls,
      ...(tenantId ? { tenantId } : {}),
    });
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, jwt, tenantId]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:py-14 sm:px-6">
      <div className="w-full max-w-[640px]">
        {ready && (
          <CourierPreferences
            mode="light"
            lightTheme={preferencesTheme}
            title={TITLE}
            subtitle={SUBTITLE}
            brandId={brandId}
          />
        )}
      </div>
    </div>
  );
}
