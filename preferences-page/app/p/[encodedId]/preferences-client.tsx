"use client";

import { useEffect, useState } from "react";
import type { CourierConfig } from "@/lib/types";
import { resolveClientConfig } from "@/lib/config";
import { PreferencesUI } from "./preferences-ui";

interface PreferencesClientProps {
  /**
   * Env-derived config from the server component (local dev). Null in production,
   * where auth comes from `window.courierConfig` instead.
   */
  fallbackConfig: CourierConfig | null;
}

type State = "loading" | "ready" | "error";

/**
 * Resolves the auth config — `window.courierConfig` (production) or the
 * env-derived `fallbackConfig` (local dev) — then hands it to `PreferencesUI`.
 *
 * The resolve runs in an effect (post-mount) so the first client render matches
 * the server render (which only ever has `fallbackConfig`), avoiding a hydration
 * mismatch when `window.courierConfig` is present.
 */
export function PreferencesClient({ fallbackConfig }: PreferencesClientProps) {
  const [config, setConfig] = useState<CourierConfig | null>(fallbackConfig);
  const [state, setState] = useState<State>(fallbackConfig ? "ready" : "loading");

  useEffect(() => {
    const resolved = resolveClientConfig(fallbackConfig);
    setConfig(resolved);
    setState(resolved ? "ready" : "error");
  }, [fallbackConfig]);

  if (state === "error" || !config) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Internal Server Error, please contact your administrator.</p>
      </div>
    );
  }

  return <PreferencesUI config={config} />;
}
