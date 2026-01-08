'use client';

import { Button } from "./ui/button";

interface CurrentUserTabProps {
  userId: string;
  onClearUser: () => void;
}

export function CurrentUserTab({ userId, onClearUser }: CurrentUserTabProps) {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">User ID</h2>
        <div className="font-mono text-sm text-muted-foreground break-all">
          {userId}
        </div>
        <Button
          type="button"
          onClick={onClearUser}
          variant="outline"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

