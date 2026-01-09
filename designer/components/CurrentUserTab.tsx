'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabFooter } from './TabFooter';
import { useFramework } from './FrameworkContext';

interface CurrentUserTabProps {
  userId: string;
  onClearUser: () => void;
  isAdvancedMode?: boolean;
  onUserIdChange?: (userId: string) => void;
}

export function CurrentUserTab({ userId, onClearUser, isAdvancedMode, onUserIdChange }: CurrentUserTabProps) {
  const { frameworkType } = useFramework();
  const [editedUserId, setEditedUserId] = useState(userId);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (onUserIdChange && editedUserId.trim()) {
      onUserIdChange(editedUserId.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUserId(userId);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">User ID</h2>
          {isAdvancedMode && isEditing ? (
            <div className="space-y-2">
              <Input
                type="text"
                value={editedUserId}
                onChange={(e) => setEditedUserId(e.target.value)}
                placeholder="Enter user ID"
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  size="sm"
                  disabled={!editedUserId.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-mono text-sm text-muted-foreground break-all">
                {userId}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear the user?')) {
                      onClearUser();
                    }
                  }}
                  variant="outline"
                >
                  Clear
                </Button>
                {isAdvancedMode && (
                  <Button
                    type="button"
                    onClick={() => {
                      setEditedUserId(userId);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </>
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

