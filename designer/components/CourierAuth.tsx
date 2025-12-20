'use client';

import { useEffect, useState, ReactNode } from "react";
import { useCourier } from "@trycourier/courier-react";
import { CourierRepo } from "@/app/lib/courier-repo";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription } from "@/components/ui/alert";

const USER_ID_STORAGE_KEY = 'courier_user_id';

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    return uuidv4();
  }

  let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }
  return userId;
}

function clearUserId(): string {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }
  return uuidv4();
}

interface CourierAuthProps {
  children: (props: { userId: string; onClearUser: () => void }) => ReactNode;
}

export function CourierAuth({ children }: CourierAuthProps) {
  const courier = useCourier();
  const [userId, setUserId] = useState<string>(() => getOrCreateUserId());
  const [initializedUserId, setInitializedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const repo = new CourierRepo();

  useEffect(() => {
    // Only initialize if userId changed or hasn't been initialized yet
    if (initializedUserId === userId) {
      return;
    }

    const initializeCourier = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await repo.generateJWT(userId);
        if (!res.token) {
          throw new Error('Failed to generate JWT');
        }

        // Sign into Courier
        courier.shared.signIn({
          userId: userId,
          jwt: res.token
        });

        setInitializedUserId(userId);
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
  }, [userId]);

  const handleClearUser = async () => {
    const newUserId = clearUserId();
    setUserId(newUserId);
    // initializeCourier will be called automatically via useEffect when userId changes
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-foreground"></div>
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

  return <>{children({ userId, onClearUser: handleClearUser })}</>;
}

