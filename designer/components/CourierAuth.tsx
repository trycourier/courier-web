'use client';

import { useEffect, useState, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  useCourier,
  type CourierApiUrls
} from "@trycourier/courier-react";
import { CourierRepo } from "@/app/lib/courier-repo";
import { API_ENVIRONMENT_PRESETS } from "@/app/lib/api-urls";
import { Alert, AlertDescription } from "@/components/ui/alert";

/** Inbox demo default user id persistence (main designer page). */
export const COURIER_DEMO_USER_ID_STORAGE_KEY = 'courier_user_id';
/** Isolated user id for the /tests page — never shared with the inbox demo. */
export const COURIER_TESTS_USER_ID_STORAGE_KEY = 'courier_tests_user_id';

function generateUUID(): string {
  return crypto.randomUUID();
}

function getOrCreateUserId(storageKey: string): string {
  if (typeof window === 'undefined') {
    return generateUUID();
  }

  let userId = localStorage.getItem(storageKey);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(storageKey, userId);
  }
  return userId;
}

function clearUserId(storageKey: string): string {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(storageKey);
  }
  return generateUUID();
}

interface CourierAuthProps {
  children: (props: { userId: string; onClearUser: () => void }) => ReactNode;
  apiUrls?: CourierApiUrls;
  overrideUserId?: string;
  /**
   * Signs in scoped to this tenant, so the inbox only shows that tenant's messages.
   * Omit for an unscoped session.
   */
  tenantId?: string;
  apiKey?: string;
  hideLoadingState?: boolean;
  /** localStorage key for the anonymous user id (default: inbox demo). Use `COURIER_TESTS_USER_ID_STORAGE_KEY` on /tests. */
  userIdStorageKey?: string;
  /**
   * When true, do not call `/api/jwt` or sign in on mount. Used by the tests hub so it never depends on
   * inbox-demo JWT bootstrap; sign-in happens via the Issue JWT test (or other explicit flows).
   */
  skipJwtInitialization?: boolean;
}

export function CourierAuth({
  children,
  apiUrls,
  overrideUserId,
  tenantId,
  apiKey,
  hideLoadingState,
  userIdStorageKey = COURIER_DEMO_USER_ID_STORAGE_KEY,
  skipJwtInitialization = false,
}: CourierAuthProps) {
  const courier = useCourier();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [storedUserId, setStoredUserId] = useState<string>(() => getOrCreateUserId(userIdStorageKey));

  // Use override if provided, otherwise use stored
  const userId = overrideUserId || storedUserId;
  const [initializedUserId, setInitializedUserId] = useState<string | null>(null);
  const [initializedApiUrls, setInitializedApiUrls] = useState<CourierApiUrls | undefined>(undefined);
  const [initializedTenantId, setInitializedTenantId] = useState<string | undefined>(undefined);
  const [initializedApiKey, setInitializedApiKey] = useState<string | undefined>(undefined);
  /** Kept so a tenant switch can re-scope the feed without minting a new token. */
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => !skipJwtInitialization);
  const [error, setError] = useState<string | null>(null);
  const repo = new CourierRepo();

  // Get courierRest from apiUrls or default
  const courierRest = apiUrls?.courier?.rest || API_ENVIRONMENT_PRESETS.production.courier.rest;

  // Serialize apiUrls for comparison
  const apiUrlsKey = apiUrls ? JSON.stringify(apiUrls) : 'default';
  const initializedApiUrlsKey = initializedApiUrls ? JSON.stringify(initializedApiUrls) : 'default';

  useEffect(() => {
    if (skipJwtInitialization) {
      courier.shared.signIn({
        userId,
        ...(tenantId && { tenantId }),
        ...(apiKey && { publicApiKey: apiKey }),
        ...(apiUrls && { apiUrls }),
      });
      setInitializedUserId(userId);
      setInitializedApiUrls(apiUrls);
      setInitializedTenantId(tenantId);
      setIsLoading(false);
      setError(null);
      return;
    }

    // What the token is minted for. The tenant is deliberately not part of this: it
    // scopes the feed, it does not authenticate.
    const credentialUnchanged =
      initializedUserId === userId &&
      apiUrlsKey === initializedApiUrlsKey &&
      initializedApiKey === apiKey;

    if (credentialUnchanged && initializedTenantId === tenantId) {
      return;
    }

    // Tenant-only change: re-scope with the token we already hold. Minting a new one
    // would be a pointless round-trip on every switch — and a switch that fails
    // outright whenever the JWT endpoint is unhealthy, even though the existing
    // session is perfectly valid.
    if (credentialUnchanged && jwt) {
      courier.shared.signIn({
        userId,
        jwt,
        ...(tenantId && { tenantId }),
        ...(apiUrls && { apiUrls }),
      });
      setInitializedTenantId(tenantId);
      return;
    }

    // Switching tenants is a fast, interactive action, so two of these can be in
    // flight at once; without this the slower one wins and leaves the client on the
    // tenant the user already moved away from.
    let cancelled = false;

    const initializeCourier = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await repo.generateJWT(userId, apiKey, courierRest);
        if (cancelled) {
          return;
        }
        if (!res.token) {
          throw new Error('Failed to generate JWT');
        }

        // Sign into Courier with optional custom API URLs
        courier.shared.signIn({
          userId: userId,
          jwt: res.token,
          ...(tenantId && { tenantId }),
          ...(apiUrls && { apiUrls })
        });

        setJwt(res.token);
        setInitializedUserId(userId);
        setInitializedApiUrls(apiUrls);
        setInitializedTenantId(tenantId);
        setInitializedApiKey(apiKey);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Courier';
        setError(errorMessage);
        setIsLoading(false);
        console.error('Error initializing Courier:', err);
      }
    };

    initializeCourier();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, tenantId, apiUrlsKey, apiKey, skipJwtInitialization]);

  const handleClearUser = async () => {
    // If using URL override, remove the userId param from URL
    if (overrideUserId) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('userId');
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
      return;
    }
    // Otherwise, clear the stored user and generate a new one
    const newUserId = clearUserId(userIdStorageKey);
    setStoredUserId(newUserId);
    // initializeCourier will be called automatically via useEffect when userId changes
  };

  if (isLoading && !hideLoadingState) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Setting up...</p>
      </div>
    );
  }

  if (error && !hideLoadingState) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children({ userId, onClearUser: handleClearUser })}</>;
}
