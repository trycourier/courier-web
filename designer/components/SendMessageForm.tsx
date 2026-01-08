'use client';

import { useState } from "react";
import { CourierRepo, type MessageAction } from "@/app/lib/courier-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SendMessageFormProps {
  userId: string;
  apiKey?: string;
}

interface ActionField {
  id: string;
  content: string;
  href: string;
}

export function SendMessageForm({ userId, apiKey }: SendMessageFormProps) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [actions, setActions] = useState<ActionField[]>([]);
  const repo = new CourierRepo();

  const addAction = () => {
    setActions([...actions, { id: crypto.randomUUID(), content: '', href: '' }]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id));
  };

  const updateAction = (id: string, field: 'content' | 'href', value: string) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

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

      // Filter out empty actions and map to the API format
      const validActions: MessageAction[] = actions
        .filter(action => action.content.trim() && action.href.trim())
        .map(action => ({
          content: action.content.trim(),
          href: action.href.trim(),
        }));

      await repo.sendMessage(
        userId,
        title,
        body,
        tagsArray.length > 0 ? tagsArray : undefined,
        validActions.length > 0 ? validActions : undefined,
        apiKey
      );
      setTitle('');
      setBody('');
      setTags('');
      setActions([]);
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              Actions <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAction}
            >
              + Add Action
            </Button>
          </div>
          {actions.map((action, index) => (
            <div key={action.id} className="flex gap-2 items-start p-3 border border-border rounded-md bg-muted/30">
              <div className="flex-1 space-y-2">
                <Input
                  type="text"
                  value={action.content}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    updateAction(action.id, 'content', e.target.value)
                  }
                  placeholder="Button label (e.g., View Details)"
                />
                <Input
                  type="url"
                  value={action.href}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    updateAction(action.id, 'href', e.target.value)
                  }
                  placeholder="URL (e.g., https://example.com)"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeAction(action.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                ✕
              </Button>
            </div>
          ))}
          {actions.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Add action buttons that appear in the notification.
            </p>
          )}
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

