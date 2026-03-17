'use client';

import { useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  type CourierApiRegion,
  type CourierApiUrls,
  getCourierApiUrlsForRegion
} from "@trycourier/courier-react";
import { DEFAULT_API_REGION } from '@/app/lib/api-urls';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const DEFAULT_API_URLS = getCourierApiUrlsForRegion(DEFAULT_API_REGION);

export type ApiUrls = CourierApiUrls;

interface AdvancedTabProps {
  apiUrls: ApiUrls;
  apiRegion: CourierApiRegion;
}

export function AdvancedTab({ apiUrls, apiRegion }: AdvancedTabProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedApiRegion, setSelectedApiRegion] = useState<CourierApiRegion>(apiRegion);
  // Local state for form inputs, initialized from current values
  const [courierRest, setCourierRest] = useState(apiUrls.courier.rest);
  const [courierGraphql, setCourierGraphql] = useState(apiUrls.courier.graphql);
  const [inboxGraphql, setInboxGraphql] = useState(apiUrls.inbox.graphql);
  const [inboxWebSocket, setInboxWebSocket] = useState(apiUrls.inbox.webSocket);

  // Get initial apiKey from URL params
  const initialApiKey = searchParams.get('apiKey') || '';
  const [apiKey, setApiKey] = useState(initialApiKey);

  const selectedPresetApiUrls = getCourierApiUrlsForRegion(selectedApiRegion);

  const handleSave = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedApiRegion !== DEFAULT_API_REGION) {
      params.set('apiRegion', selectedApiRegion);
    } else {
      params.delete('apiRegion');
    }

    // Set or remove each param based on whether it differs from default
    if (courierRest !== selectedPresetApiUrls.courier.rest) {
      params.set('courierRest', courierRest);
    } else {
      params.delete('courierRest');
    }

    if (courierGraphql !== selectedPresetApiUrls.courier.graphql) {
      params.set('courierGraphql', courierGraphql);
    } else {
      params.delete('courierGraphql');
    }

    if (inboxGraphql !== selectedPresetApiUrls.inbox.graphql) {
      params.set('inboxGraphql', inboxGraphql);
    } else {
      params.delete('inboxGraphql');
    }

    if (inboxWebSocket !== selectedPresetApiUrls.inbox.webSocket) {
      params.set('inboxWebSocket', inboxWebSocket);
    } else {
      params.delete('inboxWebSocket');
    }

    if (apiKey.trim()) {
      params.set('apiKey', apiKey.trim());
    } else {
      params.delete('apiKey');
    }

    // Build new URL and reload
    // Ensure basePath is included in the URL
    const basePath = '/inbox-demo';
    let path = pathname;
    if (!pathname.startsWith(basePath)) {
      // If pathname is just "/", use basePath, otherwise prepend basePath
      path = pathname === '/' ? basePath : `${basePath}${pathname}`;
    }
    const newUrl = params.toString() ? `${path}?${params.toString()}` : path;
    window.location.href = newUrl;
  };

  const handleReset = () => {
    setCourierRest(selectedPresetApiUrls.courier.rest);
    setCourierGraphql(selectedPresetApiUrls.courier.graphql);
    setInboxGraphql(selectedPresetApiUrls.inbox.graphql);
    setInboxWebSocket(selectedPresetApiUrls.inbox.webSocket);
    setApiKey('');
  };

  const hasChanges =
    selectedApiRegion !== apiRegion ||
    courierRest !== apiUrls.courier.rest ||
    courierGraphql !== apiUrls.courier.graphql ||
    inboxGraphql !== apiUrls.inbox.graphql ||
    inboxWebSocket !== apiUrls.inbox.webSocket ||
    apiKey !== initialApiKey;

  const handleApiRegionChange = (nextRegion: CourierApiRegion) => {
    const nextPresetApiUrls = getCourierApiUrlsForRegion(nextRegion);

    setSelectedApiRegion(nextRegion);
    setCourierRest(nextPresetApiUrls.courier.rest);
    setCourierGraphql(nextPresetApiUrls.courier.graphql);
    setInboxGraphql(nextPresetApiUrls.inbox.graphql);
    setInboxWebSocket(nextPresetApiUrls.inbox.webSocket);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Endpoint Preset</h3>

          <div className="space-y-2">
            <Label htmlFor="api-region" className="text-sm text-muted-foreground">
              Region
            </Label>
            <Select value={selectedApiRegion} onValueChange={handleApiRegionChange}>
              <SelectTrigger id="api-region" className="w-full font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">US</SelectItem>
                <SelectItem value="eu">EU</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Presets fill all Courier and Inbox endpoints. You can still override any field below.
            </p>
          </div>
        </div>

        {/* API Key Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">API Key</h3>

          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm text-muted-foreground">
              Courier API Key <span className="text-xs">(optional, overrides server default)</span>
            </Label>
            <Input
              id="api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pk_prod_..."
              className="font-mono"
            />
          </div>
        </div>

        {/* Courier API Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Courier API</h3>

          <div className="space-y-2">
            <Label htmlFor="courier-rest" className="text-sm text-muted-foreground">
              REST Endpoint
            </Label>
            <Input
              id="courier-rest"
              type="text"
              value={courierRest}
              onChange={(e) => setCourierRest(e.target.value)}
              placeholder={DEFAULT_API_URLS.courier.rest}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courier-graphql" className="text-sm text-muted-foreground">
              GraphQL Endpoint
            </Label>
            <Input
              id="courier-graphql"
              type="text"
              value={courierGraphql}
              onChange={(e) => setCourierGraphql(e.target.value)}
              placeholder={DEFAULT_API_URLS.courier.graphql}
              className="font-mono"
            />
          </div>
        </div>

        {/* Inbox API Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Inbox API</h3>

          <div className="space-y-2">
            <Label htmlFor="inbox-graphql" className="text-sm text-muted-foreground">
              GraphQL Endpoint
            </Label>
            <Input
              id="inbox-graphql"
              type="text"
              value={inboxGraphql}
              onChange={(e) => setInboxGraphql(e.target.value)}
              placeholder={DEFAULT_API_URLS.inbox.graphql}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inbox-websocket" className="text-sm text-muted-foreground">
              WebSocket Endpoint
            </Label>
            <Input
              id="inbox-websocket"
              type="text"
              value={inboxWebSocket}
              onChange={(e) => setInboxWebSocket(e.target.value)}
              placeholder={DEFAULT_API_URLS.inbox.webSocket}
              className="font-mono"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Reset to Preset
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
