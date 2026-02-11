'use client';

import { useState } from "react";
import { CourierRepo, type MessageAction } from "@/app/lib/courier-repo";
import {
  substituteVariables,
  substituteVariablesRaw,
  markdownLinksToHtml,
} from "@/app/lib/message-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SendMessageFormProps {
  userId: string;
  apiKey?: string;
  courierRest?: string;
}

interface ActionField {
  id: string;
  content: string;
  href: string;
}

interface VariableField {
  id: string;
  key: string;
  value: string;
}

export function SendMessageForm({ userId, apiKey, courierRest }: SendMessageFormProps) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [actions, setActions] = useState<ActionField[]>([]);
  const [variables, setVariables] = useState<VariableField[]>([]);
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

  const addVariable = () => {
    setVariables([...variables, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const updateVariable = (id: string, field: 'key' | 'value', value: string) => {
    setVariables(variables.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setSendMessageError(null);
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const varsRecord: Record<string, string> = {};
      variables
        .filter(v => v.key.trim() !== '')
        .forEach(v => { varsRecord[v.key.trim()] = v.value; });

      let resolvedTitle = substituteVariables(title.trim(), varsRecord);
      let resolvedBody = substituteVariables(body.trim(), varsRecord);
      resolvedBody = markdownLinksToHtml(resolvedBody);

      const validActions: MessageAction[] = actions
        .filter(action => action.content.trim() && action.href.trim())
        .map(action => ({
          content: substituteVariables(action.content.trim(), varsRecord),
          href: substituteVariablesRaw(action.href.trim(), varsRecord),
        }));

      await repo.sendMessage(
        userId,
        resolvedTitle,
        resolvedBody,
        tagsArray.length > 0 ? tagsArray : undefined,
        validActions.length > 0 ? validActions : undefined,
        apiKey,
        courierRest
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
            className="font-mono"
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
            placeholder="Enter message body. Use [link text](https://url) for links and {{variableName}} for variables."
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Links: <code className="bg-muted px-1 rounded">[text](https://example.com)</code> — Variables: <code className="bg-muted px-1 rounded">{'{{name}}'}</code>
          </p>
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
            className="font-mono"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              Variables <span className="text-muted-foreground text-xs font-normal">(optional, for {'{{key}}'} in title, body, and action URLs)</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariable}
            >
              + Add Variable
            </Button>
          </div>
          {variables.map((v) => (
            <div key={v.id} className="flex gap-2 items-center p-3 border border-border rounded-md bg-muted/20">
              <Input
                type="text"
                value={v.key}
                onChange={(e) => updateVariable(v.id, 'key', e.target.value)}
                placeholder="key"
                className="font-mono flex-1"
              />
              <Input
                type="text"
                value={v.value}
                onChange={(e) => updateVariable(v.id, 'value', e.target.value)}
                placeholder="value"
                className="font-mono flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeVariable(v.id)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                ✕
              </Button>
            </div>
          ))}
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
                  className="font-mono"
                />
                <Input
                  type="url"
                  value={action.href}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateAction(action.id, 'href', e.target.value)
                  }
                  placeholder="URL (e.g., https://example.com or https://site.com/{{id}})"
                  className="font-mono"
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

