import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { DecodedParams } from "@/lib/types";
import { decodeParams } from "@/lib/decode-params";
import { buildAuthContext } from "@/lib/auth";
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

  // `draft` is decoded for backwards compatibility but ignored: the
  // CourierPreferences component only renders published preference pages.
  const { workspaceId, brandId, userId, accountId, apiKey, env } = decoded;

  // Mint a user JWT on the server from the API key carried in the token. The
  // client signs in with this JWT so the component can read/write preferences.
  let jwt: string;
  try {
    ({ jwt } = await buildAuthContext(workspaceId, userId, apiKey, env));
  } catch (error) {
    console.error("[preferences-page] Failed to authenticate:", error);
    return <ErrorPage />;
  }

  return (
    <PreferencesClient
      userId={userId}
      jwt={jwt}
      apiUrls={getApiUrls(env)}
      tenantId={accountId || undefined}
      brandId={brandId || undefined}
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
