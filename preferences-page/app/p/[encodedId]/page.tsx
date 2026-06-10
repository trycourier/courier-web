import type { Metadata } from "next";
import { getDevConfig } from "@/lib/dev-config";
import { PreferencesClient } from "./preferences-client";

export const metadata: Metadata = {
  title: "Manage Notification Preferences",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ encodedId: string }>;
}

/**
 * Server component. In production this page is built into the embed bundle the
 * backend inlines, and auth comes from `window.courierConfig` — the `encodedId`
 * is decoded and the JWT minted by the backend before the bundle runs.
 *
 * For the local dev loop we compute an env-derived config (`COURIER_JWT` in
 * `.env.local`) here and pass it as `fallbackConfig`; the `encodedId` route param
 * is unused locally since the env supplies the full context. In production
 * `getDevConfig()` returns null and `window.courierConfig` wins.
 */
export default async function HostedPreferencesPage({ params }: PageProps) {
  await params; // satisfy Next's dynamic-params contract; unused in the env path
  const fallbackConfig = getDevConfig();
  return <PreferencesClient fallbackConfig={fallbackConfig} />;
}
