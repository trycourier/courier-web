"use client";

import { useState, useCallback } from "react";

type PageMode = "preferences" | "unsubscribe";

export default function Home() {
  const [mode, setMode] = useState<PageMode>("preferences");
  const [apiKey, setApiKey] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [userId, setUserId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [env, setEnv] = useState<"production" | "staging" | "dev">("production");
  const [topicId, setTopicId] = useState("");
  const [list, setList] = useState(false);

  const baseCanSubmit = apiKey.trim() && workspaceId.trim() && userId.trim();
  const canSubmit =
    mode === "unsubscribe"
      ? baseCanSubmit && topicId.trim()
      : baseCanSubmit;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      if (mode === "unsubscribe") {
        const segments = [
          workspaceId.trim(),
          brandId.trim(),
          userId.trim(),
          topicId.trim(),
          String(list),
          accountId.trim(),
          apiKey.trim(),
          env,
        ];
        const encoded = btoa(segments.join("#"));
        window.location.href = `/u/${encodeURIComponent(encoded)}`;
      } else {
        const segments = [
          workspaceId.trim(),
          brandId.trim(),
          userId.trim(),
          accountId.trim(),
          apiKey.trim(),
          env,
        ];
        const encoded = btoa(segments.join("#"));
        window.location.href = `/p/${encodeURIComponent(encoded)}`;
      }
    },
    [canSubmit, mode, apiKey, workspaceId, userId, brandId, accountId, env, topicId, list]
  );

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl px-8 py-9 shadow-sm">
        <h1 className="text-xl font-bold mb-1">Preferences Page Tester</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your workspace details to preview the hosted preferences page.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Page Type">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as PageMode)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors bg-white"
            >
              <option value="preferences">Preferences Page</option>
              <option value="unsubscribe">Unsubscribe Page</option>
            </select>
          </Field>

          <Field label="API Key" required>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pk_prod_..."
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
            />
          </Field>

          <Field label="Workspace ID" required>
            <input
              type="text"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="c35babb5-f063-44e7-a286-..."
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
            />
          </Field>

          <Field label="User ID" required>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="user-123"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
            />
          </Field>

          {mode === "unsubscribe" && (
            <Field label="Topic / Template ID" required>
              <input
                type="text"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                placeholder="TEMPLATE_ID"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
              />
            </Field>
          )}

          <Field label="Brand ID">
            <input
              type="text"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
            />
          </Field>

          <Field label="Account / Tenant ID">
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
            />
          </Field>

          <Field label="Environment">
            <select
              value={env}
              onChange={(e) => setEnv(e.target.value as "production" | "staging" | "dev")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors bg-white"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="dev">Dev</option>
            </select>
          </Field>

          {mode === "unsubscribe" && (
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={list}
                onChange={(e) => setList(e.target.checked)}
              />
              <span>List unsubscribe mode</span>
            </label>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 py-2.5 text-sm font-semibold text-white bg-primary rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            {mode === "unsubscribe" ? "Open Unsubscribe Page" : "Open Preferences Page"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[13px] font-semibold">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
