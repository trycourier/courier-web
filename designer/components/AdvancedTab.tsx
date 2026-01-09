'use client';

import { useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Default API URLs from courier-js
export const DEFAULT_API_URLS = {
  courier: {
    rest: 'https://api.courier.com',
    graphql: 'https://api.courier.com/client/q',
  },
  inbox: {
    graphql: 'https://inbox.courier.com/q',
    webSocket: 'wss://realtime.courier.io',
  },
};

export interface ApiUrls {
  courier: {
    rest: string;
    graphql: string;
  };
  inbox: {
    graphql: string;
    webSocket: string;
  };
}

interface AdvancedTabProps {
  apiUrls: ApiUrls;
}

export function AdvancedTab({ apiUrls }: AdvancedTabProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Local state for form inputs, initialized from current values
  const [courierRest, setCourierRest] = useState(apiUrls.courier.rest);
  const [courierGraphql, setCourierGraphql] = useState(apiUrls.courier.graphql);
  const [inboxGraphql, setInboxGraphql] = useState(apiUrls.inbox.graphql);
  const [inboxWebSocket, setInboxWebSocket] = useState(apiUrls.inbox.webSocket);

  // Get initial apiKey from URL params
  const initialApiKey = searchParams.get('apiKey') || '';
  const [apiKey, setApiKey] = useState(initialApiKey);

  const handleSave = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Set or remove each param based on whether it differs from default
    if (courierRest !== DEFAULT_API_URLS.courier.rest) {
      params.set('courierRest', courierRest);
    } else {
      params.delete('courierRest');
    }

    if (courierGraphql !== DEFAULT_API_URLS.courier.graphql) {
      params.set('courierGraphql', courierGraphql);
    } else {
      params.delete('courierGraphql');
    }

    if (inboxGraphql !== DEFAULT_API_URLS.inbox.graphql) {
      params.set('inboxGraphql', inboxGraphql);
    } else {
      params.delete('inboxGraphql');
    }

    if (inboxWebSocket !== DEFAULT_API_URLS.inbox.webSocket) {
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
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    window.location.href = newUrl;
  };

  const handleReset = () => {
    setCourierRest(DEFAULT_API_URLS.courier.rest);
    setCourierGraphql(DEFAULT_API_URLS.courier.graphql);
    setInboxGraphql(DEFAULT_API_URLS.inbox.graphql);
    setInboxWebSocket(DEFAULT_API_URLS.inbox.webSocket);
    setApiKey('');
  };

  const hasChanges =
    courierRest !== apiUrls.courier.rest ||
    courierGraphql !== apiUrls.courier.graphql ||
    inboxGraphql !== apiUrls.inbox.graphql ||
    inboxWebSocket !== apiUrls.inbox.webSocket ||
    apiKey !== initialApiKey;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-6">
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
            Reset to Defaults
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
