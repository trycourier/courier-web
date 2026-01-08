'use client';

import { useEffect, useState, ReactNode } from "react";
import { useCourier, type CourierApiUrls } from "@trycourier/courier-react";
import { CourierRepo } from "@/app/lib/courier-repo";
import { Alert, AlertDescription } from "@/components/ui/alert";

const USER_ID_STORAGE_KEY = 'courier_user_id';

function generateUUID(): string {
  return crypto.randomUUID();
}

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    return generateUUID();
  }

  let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }
  return userId;
}

function clearUserId(): string {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }
  return generateUUID();
}

interface CourierAuthProps {
  children: (props: { userId: string; onClearUser: () => void; isUrlOverride: boolean }) => ReactNode;
  apiUrls?: CourierApiUrls;
  overrideUserId?: string;
  apiKey?: string;
}

export function CourierAuth({ children, apiUrls, overrideUserId, apiKey }: CourierAuthProps) {
  const courier = useCourier();
  const [storedUserId, setStoredUserId] = useState<string>(() => getOrCreateUserId());

  // Use override if provided, otherwise use stored
  const userId = overrideUserId || storedUserId;
  const isUrlOverride = !!overrideUserId;
  const [initializedUserId, setInitializedUserId] = useState<string | null>(null);
  const [initializedApiUrls, setInitializedApiUrls] = useState<CourierApiUrls | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const repo = new CourierRepo();

  // Serialize apiUrls for comparison
  const apiUrlsKey = apiUrls ? JSON.stringify(apiUrls) : 'default';
  const initializedApiUrlsKey = initializedApiUrls ? JSON.stringify(initializedApiUrls) : 'default';

  useEffect(() => {
    // Only initialize if userId changed, apiUrls changed, or hasn't been initialized yet
    if (initializedUserId === userId && apiUrlsKey === initializedApiUrlsKey) {
      return;
    }

    const initializeCourier = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await repo.generateJWT(userId, apiKey);
        if (!res.token) {
          throw new Error('Failed to generate JWT');
        }

        // Sign into Courier with optional custom API URLs
        courier.shared.signIn({
          userId: userId,
          jwt: res.token,
          ...(apiUrls && { apiUrls })
        });

        setInitializedUserId(userId);
        setInitializedApiUrls(apiUrls);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Courier';
        setError(errorMessage);
        setIsLoading(false);
        console.error('Error initializing Courier:', err);
      }
    };

    initializeCourier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, apiUrlsKey, apiKey]);

  const handleClearUser = async () => {
    if (isUrlOverride) {
      // Can't clear a URL-provided userId - would need to remove from URL
      return;
    }
    const newUserId = clearUserId();
    setStoredUserId(newUserId);
    // initializeCourier will be called automatically via useEffect when userId changes
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Setting up...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children({ userId, onClearUser: handleClearUser, isUrlOverride })}</>;
}

