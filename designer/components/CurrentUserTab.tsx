'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabFooter } from './TabFooter';
import { useFramework } from './FrameworkContext';

interface CurrentUserTabProps {
  userId: string;
  onClearUser: () => void;
  isUrlOverride?: boolean;
}

export function CurrentUserTab({ userId, onClearUser, isUrlOverride }: CurrentUserTabProps) {
  const { frameworkType } = useFramework();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">User ID</h2>
            {isUrlOverride && (
              <Badge variant="secondary" className="text-xs">from URL</Badge>
            )}
          </div>
          <div className="font-mono text-sm text-muted-foreground break-all">
            {userId}
          </div>
          {isUrlOverride ? (
            <p className="text-xs text-muted-foreground">
              Remove <code className="bg-muted px-1 rounded">userId</code> from the URL to use auto-generated IDs.
            </p>
          ) : (
            <Button
              type="button"
              onClick={onClearUser}
              variant="outline"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-border p-4">
        <TabFooter
          copy="Authenticate users with JWT tokens generated from your backend server."
          primaryButton={{
            label: "Authentication",
            url: frameworkType === 'react'
              ? 'https://www.courier.com/docs/sdk-libraries/courier-react-web#authentication'
              : 'https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web#authentication'
          }}
        />
      </div>
    </div>
  );
}

