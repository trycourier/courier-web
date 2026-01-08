'use client';

import { useState } from "react";
import { CourierRepo } from "../app/lib/courier-repo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";

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
    <div className="p-4 h-full overflow-y-auto">
      <form onSubmit={handleSendMessage} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Textarea
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)}
            required
            rows={2}
            placeholder="Enter message title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
            required
            rows={3}
            placeholder="Enter message body"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">
            Tags <span className="text-muted-foreground text-xs font-normal">(optional, comma-separated)</span>
          </Label>
          <Input
            id="tags"
            type="text"
            value={tags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
            placeholder="e.g., important, notification, marketing"
          />
        </div>
        <div>
          <Button
            type="submit"
            disabled={isSendingMessage || !title.trim() || !body.trim()}
          >
            {isSendingMessage ? 'Sending...' : 'Send'}
          </Button>
        </div>
        {sendMessageError && (
          <Alert variant="destructive">
            <AlertDescription>{sendMessageError}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}

