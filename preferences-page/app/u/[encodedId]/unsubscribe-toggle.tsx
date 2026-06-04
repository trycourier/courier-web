"use client";

import { useState, useCallback } from "react";
import type { PreferenceStatus, AuthContext } from "@/lib/types";

interface UnsubscribeToggleProps {
  topicId: string;
  defaultStatus: PreferenceStatus;
  initialOptedIn: boolean;
  primaryColor: string;
  auth: AuthContext;
  accountId: string;
}

const UPDATE_MUTATION = `
  mutation UpdateRecipientPreferences($id: String!, $preferences: PreferencesInput!, $accountId: String) {
    updatePreferenceV2(templateId: $id preferences: $preferences accountId: $accountId) {
      templateId
      status
      hasCustomRouting
      routingPreferences
      digestSchedule
    }
  }
`;

export function UnsubscribeToggle({
  topicId,
  defaultStatus,
  initialOptedIn,
  primaryColor,
  auth,
  accountId,
}: UnsubscribeToggleProps) {
  const [optedIn, setOptedIn] = useState(initialOptedIn);
  const isRequired = defaultStatus === "REQUIRED";

  const handleToggle = useCallback(async () => {
    if (isRequired) return;

    const newOptedIn = !optedIn;
    setOptedIn(newOptedIn);

    try {
      const res = await fetch(auth.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.jwt}`,
          "x-courier-client-key": auth.clientKey,
        },
        body: JSON.stringify({
          query: UPDATE_MUTATION,
          variables: {
            id: topicId,
            preferences: {
              status: newOptedIn ? "OPTED_IN" : "OPTED_OUT",
            },
            accountId: accountId || undefined,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors[0].message);
    } catch {
      setOptedIn(optedIn);
    }
  }, [optedIn, isRequired, auth, topicId, accountId]);

  const label = isRequired
    ? "Required"
    : optedIn
      ? "Subscribed"
      : "Unsubscribed";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={optedIn}
        disabled={isRequired}
        onClick={handleToggle}
        className="toggle-switch"
        style={
          optedIn
            ? ({ "--toggle-color": primaryColor } as React.CSSProperties)
            : undefined
        }
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}
