'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyFieldButton } from './CopyFieldButton';
import { Copyable } from './Copyable';
import { TabFooter } from './TabFooter';
import { useFramework } from './FrameworkContext';

interface CurrentUserTabProps {
  userId: string;
  onClearUser: () => void;
  isAdvancedMode?: boolean;
  onUserIdChange?: (userId: string) => void;
  /** Tenant the session is scoped to. Empty means an unscoped session. */
  tenantId?: string;
  onTenantIdChange?: (tenantId: string) => void;
}

export function CurrentUserTab({
  userId,
  onClearUser,
  isAdvancedMode,
  onUserIdChange,
  tenantId = '',
  onTenantIdChange,
}: CurrentUserTabProps) {
  const { frameworkType } = useFramework();
  const [editedUserId, setEditedUserId] = useState(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTenantId, setEditedTenantId] = useState(tenantId);
  const [isEditingTenant, setIsEditingTenant] = useState(false);

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

  // Unlike the user id, an empty tenant is meaningful: it signs the session back in
  // unscoped, so saving a blank value is allowed.
  const handleSaveTenant = () => {
    onTenantIdChange?.(editedTenantId.trim());
    setIsEditingTenant(false);
  };

  const handleCancelTenant = () => {
    setEditedTenantId(tenantId);
    setIsEditingTenant(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">User ID</h2>
          {isAdvancedMode && isEditing ? (
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={editedUserId}
                  onChange={(e) => setEditedUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="font-mono text-sm flex-1 min-w-0"
                />
                <CopyFieldButton value={editedUserId} label="user ID" className="shrink-0" />
              </div>
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
              <Copyable
                value={userId}
                className="min-w-0"
                contentClassName="text-sm text-muted-foreground"
              >
                {userId}
              </Copyable>
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

          {/* Tenant scoping is an advanced concern — hidden entirely otherwise. */}
          {isAdvancedMode && (
            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <h2 className="text-lg font-semibold">Tenant ID</h2>
                <p className="text-sm text-muted-foreground">
                  Scopes the session to one tenant, so the inbox only shows that tenant&apos;s
                  messages. Leave empty for an unscoped session.
                </p>
              </div>
              {isEditingTenant ? (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={editedTenantId}
                      onChange={(e) => setEditedTenantId(e.target.value)}
                      placeholder="Enter tenant ID"
                      className="font-mono text-sm flex-1 min-w-0"
                    />
                    <CopyFieldButton value={editedTenantId} label="tenant ID" className="shrink-0" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={handleCancelTenant} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveTenant} size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {tenantId ? (
                    <Copyable
                      value={tenantId}
                      className="min-w-0"
                      contentClassName="text-sm text-muted-foreground"
                    >
                      {tenantId}
                    </Copyable>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tenant (unscoped)</p>
                  )}
                  <div className="flex gap-2">
                    {tenantId && (
                      <Button
                        type="button"
                        onClick={() => onTenantIdChange?.('')}
                        variant="outline"
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={() => {
                        setEditedTenantId(tenantId);
                        setIsEditingTenant(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </>
              )}
            </div>
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

