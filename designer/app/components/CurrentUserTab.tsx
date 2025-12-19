'use client';

interface CurrentUserTabProps {
  userId: string;
  onClearUser: () => void;
}

export function CurrentUserTab({ userId, onClearUser }: CurrentUserTabProps) {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Current User ID
          </label>
          <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
            {userId}
          </pre>
        </div>
        <button
          type="button"
          onClick={onClearUser}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear User & Regenerate
        </button>
      </div>
    </div>
  );
}

