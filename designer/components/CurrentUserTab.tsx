'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CurrentUserTabProps {
  userId: string;
  onClearUser: () => void;
}

export function CurrentUserTab({ userId, onClearUser }: CurrentUserTabProps) {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current User ID</Label>
            <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
              {userId}
            </pre>
          </div>
          <Button
            type="button"
            onClick={onClearUser}
            variant="secondary"
            className="w-full"
          >
            Clear User & Regenerate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

