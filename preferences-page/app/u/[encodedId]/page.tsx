import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeUnsubscribeParams } from "@/lib/decode-params";
import { buildAuthContextFromEnv } from "@/lib/auth";
import { encodeBase64 } from "@/lib/token";
import {
  fetchPreferencePage,
  fetchRecipientPreferences,
  updateRecipientPreference,
} from "@/lib/graphql";
import type {
  PreferencePage,
  PreferenceTopic,
  RecipientPreference,
  AuthContext,
  Brand,
} from "@/lib/types";
import { Footer } from "@/app/components/footer";
import { UnsubscribeToggle } from "./unsubscribe-toggle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ encodedId: string }>;
}

function getContextText(isRequired: boolean, list: boolean): string {
  if (list) {
    if (isRequired) {
      return "You may still receive this notification as it has been marked required for your account. If you wish to unsubscribe, please contact your account administrator.";
    }
    return "You may still receive this notification. If you do not wish to receive this notification, you may unsubscribe below.";
  }
  if (isRequired) {
    return "Your account is required to receive this communication. If you'd like to opt out of this notification, please contact your account administrator.";
  }
  return "You've been unsubscribed, we're sorry to see you go. If you change your mind, you can opt back in below.";
}

function buildPreferencesPageUrl(
  workspaceId: string,
  brandId: string,
  userId: string,
  accountId: string,
  env: string
): string {
  // Fixed 6-segment layout (matches the tester / decodeParams): accountId holds
  // its position even when empty so `env` stays at index 5.
  const segments = [workspaceId, brandId, userId, "false", accountId, env];
  const encoded = encodeBase64(segments.join("#"));
  return `/p/${encodeURIComponent(encoded)}`;
}

function findTopic(
  page: PreferencePage,
  topicId: string
): PreferenceTopic | undefined {
  for (const section of page.sections.nodes) {
    const topic = section.topics.nodes.find((t) => t.templateId === topicId);
    if (topic) return topic;
  }
  return undefined;
}

export default async function UnsubscribePage({ params }: PageProps) {
  const { encodedId } = await params;

  let decoded;
  try {
    decoded = decodeUnsubscribeParams(encodedId);
  } catch {
    notFound();
  }

  const { workspaceId, brandId, userId, topicId, list, accountId, env } =
    decoded;

  let auth: AuthContext;
  try {
    auth = buildAuthContextFromEnv();
  } catch {
    return <ErrorPage />;
  }

  let page: PreferencePage | null;
  let recipientPreferences: RecipientPreference[];
  try {
    [page, recipientPreferences] = await Promise.all([
      fetchPreferencePage(auth, accountId, brandId),
      fetchRecipientPreferences(auth, accountId),
    ]);
  } catch {
    return <ErrorPage />;
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>This page is not available. Please contact your administrator.</p>
      </div>
    );
  }

  const brand = page.brand;
  const primaryColor = brand?.settings?.colors?.primary || "#10B981";
  const logo = brand?.logo;
  const preferencesUrl = buildPreferencesPageUrl(
    workspaceId,
    brandId,
    userId,
    accountId,
    env
  );

  const topic = findTopic(page, topicId);

  if (!topic) {
    return (
      <PageShell logo={logo} showCourierFooter={page.showCourierFooter} brand={brand}>
        <main className="flex-1 bg-white rounded-xl p-5 sm:p-8">
          <p className="text-sm text-gray-500 mb-6">You have been unsubscribed.</p>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              You can customize other notifications you receive in the{" "}
              <a
                href={preferencesUrl}
                className="underline text-gray-700 hover:text-gray-900"
              >
                Notification Center
              </a>
              .
            </p>
          </div>
        </main>
      </PageShell>
    );
  }

  const isRequired = topic.defaultStatus === "REQUIRED";
  const pref = recipientPreferences.find((p) => p.templateId === topicId);

  if (!list && !isRequired && pref?.status !== "OPTED_OUT") {
    try {
      await updateRecipientPreference(
        auth,
        topicId,
        { status: "OPTED_OUT" },
        accountId
      );
    } catch {
      // best-effort; the toggle still allows re-subscribing
    }
  }

  const initialOptedIn = list
    ? (pref?.status ? pref.status === "OPTED_IN" : topic.defaultStatus !== "OPTED_OUT")
    : isRequired;

  const contextText = getContextText(isRequired, list);

  return (
    <PageShell logo={logo} showCourierFooter={page.showCourierFooter} brand={brand}>
      <main className="flex-1 bg-white rounded-xl p-5 sm:p-8">
        {list && (
          <p className="text-sm font-semibold mb-1">
            You&apos;ve been unsubscribed from this list.
          </p>
        )}
        <p className="text-sm text-gray-500 mb-6">{contextText}</p>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium mb-1">{topic.templateName}</p>
          <div className="mt-3">
            <UnsubscribeToggle
              topicId={topicId}
              defaultStatus={topic.defaultStatus}
              initialOptedIn={initialOptedIn}
              primaryColor={primaryColor}
              auth={auth}
              accountId={accountId}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-4">
          <p className="text-sm text-gray-500">
            You can customize other notifications you receive in the{" "}
            <a
              href={preferencesUrl}
              className="underline text-gray-700 hover:text-gray-900"
            >
              Notification Center
            </a>
            .
          </p>
        </div>
      </main>
    </PageShell>
  );
}

function PageShell({
  logo,
  showCourierFooter,
  brand,
  children,
}: {
  logo: { href: string; image: string } | null | undefined;
  showCourierFooter: boolean;
  brand: Brand;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4 sm:py-14 sm:px-6">
      <div className="w-full max-w-lg flex flex-col gap-5">
        {logo?.image && (
          <header className="flex justify-start">
            {logo.href ? (
              <a href={logo.href} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.image}
                  alt="Logo"
                  className="max-h-10 object-contain"
                />
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.image}
                alt="Logo"
                className="max-h-10 object-contain"
              />
            )}
          </header>
        )}

        {children}

        <Footer showCourierFooter={showCourierFooter} brand={brand} />
      </div>
    </div>
  );
}

function ErrorPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Internal Server Error, please contact your administrator.</p>
    </div>
  );
}
