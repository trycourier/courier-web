import Link from "next/link";
import { getDevConfig } from "@/lib/dev-config";

/**
 * Local dev landing. This app's real output is the preferences UI (`/p`), which
 * in production is built into a bundle the backend inlines and authenticates via
 * `window.courierConfig`. There is no tester: for local iteration you drop a
 * pre-minted client JWT into `.env.local` (`COURIER_JWT`) and the page renders
 * straight from it.
 */
export default function Home() {
  const config = getDevConfig();

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl px-8 py-9">
        <h1 className="text-xl font-bold mb-1">Hosted Preferences — Dev</h1>
        {config ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Using <code>COURIER_JWT</code> from <code>.env.local</code> (user{" "}
              <code>{config.userId}</code>).
            </p>
            <Link
              href="/p/preview"
              className="inline-block py-2.5 px-4 text-sm font-semibold text-white bg-primary rounded-md hover:opacity-90 transition-opacity"
            >
              Open Preferences Page
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Set <code>COURIER_JWT</code> in <code>.env.local</code> (a pre-minted
            user-scoped client JWT), then open{" "}
            <code>/p/preview</code>. See <code>.env.example</code>.
          </p>
        )}
      </div>
    </div>
  );
}
