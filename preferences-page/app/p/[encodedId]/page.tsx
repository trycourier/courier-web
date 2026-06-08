import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { DecodedParams, HostedPreferencesAuth } from "@/lib/types";
import { decodeParams } from "@/lib/decode-params";
import { fetchHostedPreferencesAuth } from "@/lib/auth";
import { getApiUrls } from "@/lib/api-urls";
import { PreferencesClient } from "./preferences-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Notification Preferences",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ encodedId: string }>;
}

export default async function HostedPreferencesPage({ params }: PageProps) {
  const { encodedId } = await params;

  let decoded: DecodedParams;
  try {
    decoded = decodeParams(encodedId);
  } catch {
    notFound(); // returns `never` — narrows `decoded` to DecodedParams below
  }

  // We only need `env` to pick the API host; the JWT and all user/brand/tenant
  // context come from the backend's hosted page, which mints the JWT from the
  // workspace's stored key (no local key required — see fetchHostedPreferencesAuth).
  const { env } = decoded;

  let auth: HostedPreferencesAuth;
  try {
    auth = await fetchHostedPreferencesAuth(encodedId, env);
  } catch (error) {
    console.error("[preferences-page] Failed to authenticate:", error);
    return <ErrorPage />;
  }

  return (
    <PreferencesClient
      userId={auth.userId}
      jwt={auth.jwt}
      apiUrls={getApiUrls(env)}
      tenantId={auth.tenantId}
      brandId={auth.brandId}
      draft={auth.draft}
    />
  );
}

function ErrorPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Internal Server Error, please contact your administrator.</p>
    </div>
  );
}
