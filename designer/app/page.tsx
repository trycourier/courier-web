'use client';

import { useEffect, useState } from "react";
import { CourierInbox, useCourier } from "@trycourier/courier-react";
import { CourierRepo } from "./lib/courier-repo";
import { v4 as uuidv4 } from "uuid";

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

export default function Home() {
  const courier = useCourier();
  const [userId, setUserId] = useState<string>(() => getOrCreateUserId());
  const [initializedUserId, setInitializedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setSendMessageError(null);
    try {
      await repo.sendMessage(userId, title, body);
      setTitle('');
      setBody('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setSendMessageError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleClearUser = async () => {
    const newUserId = clearUserId();
    setUserId(newUserId);
    // initializeCourier will be called automatically via useEffect when userId changes
  };

  const isInboxVisible = !isLoading && !error;

  return (
    <div className="flex h-screen w-screen flex-col bg-white dark:bg-black p-4 font-sans">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <>
          {isInboxVisible && (
            <div className="mb-4 w-full">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Enter message title"
                  />
                </div>
                <div>
                  <label htmlFor="body" className="block text-sm font-medium mb-1">
                    Body
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Enter message body"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSendingMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingMessage ? 'Sending...' : 'Send Message to Current User'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearUser}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear User & Regenerate
                  </button>
                  <pre>{userId}</pre>
                </div>
                {sendMessageError && (
                  <div className="mt-2 text-red-600 dark:text-red-400 text-sm">{sendMessageError}</div>
                )}
              </form>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <CourierInbox />
          </div>
        </>
      )}
    </div>
  );
}
