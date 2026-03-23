'use client';

import { useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { type CourierApiUrls } from "@trycourier/courier-react";
import {
  type ApiEnvironment,
  DEFAULT_API_ENVIRONMENT,
  API_ENVIRONMENT_PRESETS,
  getPresetApiUrls,
} from '@/app/lib/api-urls';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CopyFieldButton } from './CopyFieldButton';
import { Copyable } from './Copyable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type ApiUrls = CourierApiUrls;

interface AdvancedTabProps {
  apiUrls: ApiUrls;
  apiEnvironment: ApiEnvironment;
}

const ENVIRONMENT_LABELS: Record<ApiEnvironment, string> = {
  production: 'Production',
  staging: 'Staging',
  dev: 'Dev',
  custom: 'Custom',
};

export function AdvancedTab({ apiUrls, apiEnvironment }: AdvancedTabProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedEnv, setSelectedEnv] = useState<ApiEnvironment>(apiEnvironment);
  const [courierRest, setCourierRest] = useState(apiUrls.courier.rest);
  const [courierGraphql, setCourierGraphql] = useState(apiUrls.courier.graphql);
  const [inboxGraphql, setInboxGraphql] = useState(apiUrls.inbox.graphql);
  const [inboxWebSocket, setInboxWebSocket] = useState(apiUrls.inbox.webSocket);

  const initialApiKey = searchParams.get('apiKey') || '';
  const [apiKey, setApiKey] = useState(initialApiKey);
  const isCustom = selectedEnv === 'custom';

  const handleSave = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Clean up legacy param
    params.delete('apiRegion');

    if (selectedEnv !== DEFAULT_API_ENVIRONMENT) {
      params.set('env', selectedEnv);
    } else {
      params.delete('env');
    }

    if (isCustom) {
      const productionUrls = getPresetApiUrls('production');

      if (courierRest !== productionUrls.courier.rest) {
        params.set('courierRest', courierRest);
      } else {
        params.delete('courierRest');
      }

      if (courierGraphql !== productionUrls.courier.graphql) {
        params.set('courierGraphql', courierGraphql);
      } else {
        params.delete('courierGraphql');
      }

      if (inboxGraphql !== productionUrls.inbox.graphql) {
        params.set('inboxGraphql', inboxGraphql);
      } else {
        params.delete('inboxGraphql');
      }

      if (inboxWebSocket !== productionUrls.inbox.webSocket) {
        params.set('inboxWebSocket', inboxWebSocket);
      } else {
        params.delete('inboxWebSocket');
      }
    } else {
      params.delete('courierRest');
      params.delete('courierGraphql');
      params.delete('inboxGraphql');
      params.delete('inboxWebSocket');
    }

    if (apiKey.trim()) {
      params.set('apiKey', apiKey.trim());
    } else {
      params.delete('apiKey');
    }

    const basePath = '/inbox-demo';
    let path = pathname;
    if (!pathname.startsWith(basePath)) {
      path = pathname === '/' ? basePath : `${basePath}${pathname}`;
    }
    const newUrl = params.toString() ? `${path}?${params.toString()}` : path;
    window.location.href = newUrl;
  };

  const handleReset = () => {
    const preset = selectedEnv === 'custom'
      ? getPresetApiUrls('production')
      : getPresetApiUrls(selectedEnv);

    setCourierRest(preset.courier.rest);
    setCourierGraphql(preset.courier.graphql);
    setInboxGraphql(preset.inbox.graphql);
    setInboxWebSocket(preset.inbox.webSocket);
    setApiKey('');
  };

  const hasChanges =
    selectedEnv !== apiEnvironment ||
    courierRest !== apiUrls.courier.rest ||
    courierGraphql !== apiUrls.courier.graphql ||
    inboxGraphql !== apiUrls.inbox.graphql ||
    inboxWebSocket !== apiUrls.inbox.webSocket ||
    apiKey !== initialApiKey;

  const handleEnvironmentChange = (nextEnv: ApiEnvironment) => {
    setSelectedEnv(nextEnv);

    if (nextEnv === 'custom') {
      const productionUrls = getPresetApiUrls('production');
      setCourierRest(productionUrls.courier.rest);
      setCourierGraphql(productionUrls.courier.graphql);
      setInboxGraphql(productionUrls.inbox.graphql);
      setInboxWebSocket(productionUrls.inbox.webSocket);
    } else {
      const preset = API_ENVIRONMENT_PRESETS[nextEnv];
      setCourierRest(preset.courier.rest);
      setCourierGraphql(preset.courier.graphql);
      setInboxGraphql(preset.inbox.graphql);
      setInboxWebSocket(preset.inbox.webSocket);
    }
  };

  const presetUrlsForSelection =
    selectedEnv === 'custom' ? null : getPresetApiUrls(selectedEnv);

  const copyableContentClass = 'text-sm text-muted-foreground';

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Environment</h3>

          <div className="space-y-2">
            <Label htmlFor="api-environment" className="text-sm text-muted-foreground">
              API Environment
            </Label>
            <Select value={selectedEnv} onValueChange={handleEnvironmentChange}>
              <SelectTrigger id="api-environment" className="w-full font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ENVIRONMENT_LABELS) as ApiEnvironment[]).map((env) => (
                  <SelectItem key={env} value={env}>
                    {ENVIRONMENT_LABELS[env]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* API Key Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">API Key</h3>

          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm text-muted-foreground">
              Courier API Key <span className="text-xs">(optional, overrides server default)</span>
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="api-key"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="pk_prod_..."
                className="font-mono flex-1 min-w-0"
              />
              <CopyFieldButton value={apiKey} label="API key" className="shrink-0" />
            </div>
          </div>
        </div>

        {/* Preset environments: read-only Copyables (same sections as custom) */}
        {presetUrlsForSelection && (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Courier API</h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">REST Endpoint</Label>
                <Copyable
                  value={presetUrlsForSelection.courier.rest}
                  className="min-w-0"
                  contentClassName={copyableContentClass}
                >
                  {presetUrlsForSelection.courier.rest}
                </Copyable>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">GraphQL Endpoint</Label>
                <Copyable
                  value={presetUrlsForSelection.courier.graphql}
                  className="min-w-0"
                  contentClassName={copyableContentClass}
                >
                  {presetUrlsForSelection.courier.graphql}
                </Copyable>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Inbox API</h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">GraphQL Endpoint</Label>
                <Copyable
                  value={presetUrlsForSelection.inbox.graphql}
                  className="min-w-0"
                  contentClassName={copyableContentClass}
                >
                  {presetUrlsForSelection.inbox.graphql}
                </Copyable>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">WebSocket Endpoint</Label>
                <Copyable
                  value={presetUrlsForSelection.inbox.webSocket}
                  className="min-w-0"
                  contentClassName={copyableContentClass}
                >
                  {presetUrlsForSelection.inbox.webSocket}
                </Copyable>
              </div>
            </div>
          </>
        )}

        {/* Custom URL inputs — editable fields + copy */}
        {isCustom && (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Courier API</h3>

              <div className="space-y-2">
                <Label htmlFor="courier-rest" className="text-sm text-muted-foreground">
                  REST Endpoint
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="courier-rest"
                    type="text"
                    value={courierRest}
                    onChange={(e) => setCourierRest(e.target.value)}
                    placeholder="https://api.courier.com"
                    className="font-mono flex-1 min-w-0"
                  />
                  <CopyFieldButton value={courierRest} label="Courier REST endpoint" className="shrink-0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courier-graphql" className="text-sm text-muted-foreground">
                  GraphQL Endpoint
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="courier-graphql"
                    type="text"
                    value={courierGraphql}
                    onChange={(e) => setCourierGraphql(e.target.value)}
                    placeholder="https://api.courier.com/client/q"
                    className="font-mono flex-1 min-w-0"
                  />
                  <CopyFieldButton value={courierGraphql} label="Courier GraphQL endpoint" className="shrink-0" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Inbox API</h3>

              <div className="space-y-2">
                <Label htmlFor="inbox-graphql" className="text-sm text-muted-foreground">
                  GraphQL Endpoint
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="inbox-graphql"
                    type="text"
                    value={inboxGraphql}
                    onChange={(e) => setInboxGraphql(e.target.value)}
                    placeholder="https://inbox.courier.com/q"
                    className="font-mono flex-1 min-w-0"
                  />
                  <CopyFieldButton value={inboxGraphql} label="Inbox GraphQL endpoint" className="shrink-0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inbox-websocket" className="text-sm text-muted-foreground">
                  WebSocket Endpoint
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="inbox-websocket"
                    type="text"
                    value={inboxWebSocket}
                    onChange={(e) => setInboxWebSocket(e.target.value)}
                    placeholder="wss://realtime.courier.io"
                    className="font-mono flex-1 min-w-0"
                  />
                  <CopyFieldButton value={inboxWebSocket} label="Inbox WebSocket endpoint" className="shrink-0" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save & Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
