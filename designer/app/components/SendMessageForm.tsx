'use client';

import { useState } from "react";
import { CourierRepo } from "../lib/courier-repo";

interface SendMessageFormProps {
  userId: string;
}

export function SendMessageForm({ userId }: SendMessageFormProps) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const repo = new CourierRepo();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setSendMessageError(null);
    try {
      // Parse tags from comma-separated string, trim whitespace, and filter out empty strings
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await repo.sendMessage(userId, title, body, tagsArray.length > 0 ? tagsArray : undefined);
      setTitle('');
      setBody('');
      setTags('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setSendMessageError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="p-4">
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
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">(optional, comma-separated)</span>
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="e.g., important, notification, marketing"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSendingMessage}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingMessage ? 'Sending...' : 'Send Message to Current User'}
          </button>
        </div>
        {sendMessageError && (
          <div className="mt-2 text-red-600 dark:text-red-400 text-sm">{sendMessageError}</div>
        )}
      </form>
    </div>
  );
}

