'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import type { CourierTrackingEvent } from '@trycourier/courier-js';
import { useCourier } from '@trycourier/courier-react';
import { Check, Copy, Loader2, Play, X } from 'lucide-react';
import {
  type ApiEnvironment,
  getPresetApiUrls,
} from '@/app/lib/api-urls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestJsonEditor } from '@/components/tests/TestJsonEditor';

type TestApiEnvironment = Exclude<ApiEnvironment, 'custom'>;

const TEST_ENV_LABELS: Record<TestApiEnvironment, string> = {
  production: 'Production',
  staging: 'Staging',
  dev: 'Dev',
};

interface CourierTestsTabProps {
  userId: string;
  brandId?: string;
  topicId?: string;
  clientKey?: string;
  apiEnvironment?: TestApiEnvironment;
}

type CourierClientInstance = NonNullable<ReturnType<typeof useCourier>['shared']['client']>;

type TestOutcome = 'idle' | 'success' | 'error';

interface TestResultState {
  isLoading: boolean;
  output: unknown;
  lastRunAt?: string;
  outcome: TestOutcome;
}

interface CourierTestDefinition {
  id: string;
  section: string;
  title: string;
  sdkCall: string;
  sourceTest: string;
  sourceSkipped?: boolean;
  getInputs: () => Record<string, unknown>;
  run: (client: CourierClientInstance, inputs: Record<string, unknown>) => Promise<unknown>;
}

const TRACKING_TEST_URL =
  'https://d949e6c0-85f8-4284-95cc-cbf36c4c29ab.ct0.app/t/zYLfXkZVSINu0pJBSrf0EjDdSGXJQ1Bx0kRg0ZJgbK-SMa4BF7x-I9-3MsSDH5NddcUhvMMbGOz5R4rrEyKESsSKO0m4MnosFZMEjWkG-Xjy5LSmO3mad4vO5Szeg04KILk5sZHEzNO5UwikXwSmvUH7VhlhrpZWJlHvJ2i-zquPlcfsVt5C3XBP1_08ep_90gqQ40CbjW0r5JQrVHm43BV2l-WIg8CJ6eNYp4nGTtc_h1_idE-WMenw2TPpuTELIoTD5EtP8X2eKszcQ5nBQvnUxL15MnrZVSkq8-BYewOufSbewTt2bGTUbnFRDtqrrh9mUmgYHmxPnyfL9PKnPA';
const LIST_TEST_ID = 'example-list-id';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toJson(value: unknown): string {
  if (value === undefined) {
    return 'null';
  }

  return JSON.stringify(value, null, 2);
}

function inputString(inputs: Record<string, unknown>, key: string, fallback = ''): string {
  const v = inputs[key];
  if (v === undefined || v === null) {
    return fallback;
  }
  if (typeof v === 'string') {
    return v;
  }
  return String(v);
}

function inputNumber(inputs: Record<string, unknown>, key: string, defaultVal: number): number {
  const v = inputs[key];
  if (typeof v === 'number' && Number.isFinite(v)) {
    return v;
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return defaultVal;
}


function isExplicitMessageId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    !value.includes('from latest') &&
    !value.includes('from ')
  );
}

export function CourierTestsTab({ userId, brandId, topicId, clientKey, apiEnvironment = 'production' }: CourierTestsTabProps) {
  const courier = useCourier();
  const [testResults, setTestResults] = useState<Record<string, TestResultState>>({});
  const [inputDrafts, setInputDrafts] = useState<Record<string, string>>({});
  const [copiedPanel, setCopiedPanel] = useState<string | null>(null);
  const [testEnv, setTestEnv] = useState<TestApiEnvironment>(apiEnvironment);

  const handleTestEnvChange = (nextEnv: TestApiEnvironment) => {
    setTestEnv(nextEnv);
    const apiUrls = getPresetApiUrls(nextEnv);
    const currentOptions = courier.shared.client?.options;
    if (currentOptions) {
      courier.shared.signIn({
        userId: currentOptions.userId,
        jwt: currentOptions.jwt,
        publicApiKey: currentOptions.publicApiKey,
        tenantId: currentOptions.tenantId,
        showLogs: currentOptions.showLogs,
        apiUrls,
      });
    }
  };

  const copyPanel = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPanel(key);
      window.setTimeout(() => setCopiedPanel((c) => (c === key ? null : c)), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const resolvedBrandId = brandId?.trim() ?? '';
  const resolvedTopicId = topicId?.trim() ?? '';
  const resolvedClientKey = clientKey?.trim() ?? '';

  const getClient = (): CourierClientInstance => {
    const client = courier.shared.client;
    if (!client) {
      throw new Error('Courier client is not initialized yet. Wait for setup to complete and try again.');
    }
    return client;
  };

  const getFirstInboxMessage = async (client: CourierClientInstance, paginationLimit = 10) => {
    const response = await client.inbox.getMessages({ paginationLimit });
    const message = response.data?.messages?.nodes?.[0];
    if (!message?.messageId) {
      throw new Error('No inbox message found. Send a test message first.');
    }

    return {
      response,
      messageId: message.messageId,
    };
  };

  const getFirstTrackableInboxMessage = async (client: CourierClientInstance, paginationLimit = 20) => {
    const response = await client.inbox.getMessages({ paginationLimit });
    const message = response.data?.messages?.nodes?.find((item) => item.trackingIds?.clickTrackingId);

    if (!message?.messageId || !message.trackingIds?.clickTrackingId) {
      throw new Error('No message with click tracking ID found. Send a message with actionable content first.');
    }

    return {
      response,
      messageId: message.messageId,
      trackingId: message.trackingIds.clickTrackingId,
    };
  };

  const createRestoreProps = () => {
    const options = courier.shared.client?.options;
    if (!options) {
      return null;
    }

    return {
      userId: options.userId,
      jwt: options.jwt,
      publicApiKey: options.publicApiKey,
      tenantId: options.tenantId,
      showLogs: options.showLogs,
      apiUrls: options.apiUrls,
    };
  };

  const restoreSharedClient = (restoreProps: ReturnType<typeof createRestoreProps>) => {
    if (!restoreProps) {
      courier.shared.signOut();
      return;
    }

    courier.shared.signIn(restoreProps);
  };

  const tests: CourierTestDefinition[] = [
      {
        id: 'courier-client-all-options',
        section: 'Client',
        title: 'Validate shared client initialization snapshot',
        sdkCall: 'client.options',
        sourceTest: 'courier-client.test.ts > should validate client initialization with all options',
        getInputs: () => ({
          userId,
          brandId: resolvedBrandId || undefined,
          topicId: resolvedTopicId || undefined,
          clientKey: resolvedClientKey || undefined,
        }),
        run: async (client, _inputs) => {
          void _inputs;
          return client.options;
        },
      },
      {
        id: 'courier-client-minimal-options',
        section: 'Client',
        title: 'Validate minimal shared client requirements',
        sdkCall: 'client.options',
        sourceTest: 'courier-client.test.ts > should validate client initialization with minimal options',
        getInputs: () => ({
          userId,
        }),
        run: async (client, _inputs) => {
          void _inputs;
          return client.options;
        },
      },
      {
        id: 'brand-get-brand',
        section: 'Brands',
        title: 'Fetch brand settings',
        sdkCall: 'client.brands.getBrand({ brandId })',
        sourceTest: 'brand-client.test.ts > should fetch brand settings successfully',
        getInputs: () => ({
          brandId: resolvedBrandId || '',
        }),
        run: async (client, inputs) => {
          return await client.brands.getBrand({
            brandId: inputString(inputs, 'brandId'),
          });
        },
      },
      {
        id: 'preferences-get-user-preferences',
        section: 'Preferences',
        title: 'Fetch all user preferences',
        sdkCall: 'client.preferences.getUserPreferences()',
        sourceTest: 'preferences-client.test.ts > should fetch user preferences successfully',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void _inputs;
          return await client.preferences.getUserPreferences();
        },
      },
      {
        id: 'preferences-get-topic',
        section: 'Preferences',
        title: 'Fetch user preference topic',
        sdkCall: 'client.preferences.getUserPreferenceTopic({ topicId })',
        sourceTest: 'preferences-client.test.ts > should fetch user preference topic successfully',
        getInputs: () => ({
          topicId: resolvedTopicId || '',
        }),
        run: async (client, inputs) => {
          return await client.preferences.getUserPreferenceTopic({
            topicId: inputString(inputs, 'topicId'),
          });
        },
      },
      {
        id: 'preferences-put-topic',
        section: 'Preferences',
        title: 'Update user preference topic',
        sdkCall: 'client.preferences.putUserPreferenceTopic({ topicId, status, ... })',
        sourceTest: 'preferences-client.test.ts > should update user preference topic successfully',
        getInputs: () => ({
          topicId: resolvedTopicId || '',
          status: 'OPTED_IN',
          hasCustomRouting: false,
          customRouting: [],
        }),
        run: async (client, inputs) => {
          const status = inputString(inputs, 'status', 'OPTED_IN') || 'OPTED_IN';
          return await client.preferences.putUserPreferenceTopic({
            topicId: inputString(inputs, 'topicId'),
            status: status as 'OPTED_IN',
            hasCustomRouting: Boolean(inputs.hasCustomRouting ?? false),
            customRouting: Array.isArray(inputs.customRouting) ? inputs.customRouting : [],
          });
        },
      },
      {
        id: 'preferences-notification-center-url',
        section: 'Preferences',
        title: 'Get notification center URL',
        sdkCall: 'client.preferences.getNotificationCenterUrl({ clientKey })',
        sourceTest: 'preferences-client.test.ts > should get notification center url successfully',
        getInputs: () => ({
          clientKey: resolvedClientKey || '',
        }),
        run: async (client, inputs) => {
          return client.preferences.getNotificationCenterUrl({
            clientKey: inputString(inputs, 'clientKey'),
          });
        },
      },
      {
        id: 'inbox-get-messages',
        section: 'Inbox',
        title: 'Fetch inbox messages',
        sdkCall: 'client.inbox.getMessages({ paginationLimit })',
        sourceTest: 'inbox-client.test.ts > should fetch messages and unread count',
        getInputs: () => ({
          paginationLimit: 10,
        }),
        run: async (client, inputs) => {
          return await client.inbox.getMessages({
            paginationLimit: inputNumber(inputs, 'paginationLimit', 10),
          });
        },
      },
      {
        id: 'inbox-get-messages-with-filters',
        section: 'Inbox',
        title: 'Fetch inbox messages with filters',
        sdkCall: 'client.inbox.getMessages({ filter })',
        sourceTest: 'inbox-client.test.ts > should fetch messages with filters',
        getInputs: () => ({
          filter: {
            status: 'unread',
            tags: ['my-tag'],
          },
        }),
        run: async (client, inputs) => {
          const filter = inputs.filter;
          if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
            throw new Error('JSON inputs must include a filter object.');
          }
          return await client.inbox.getMessages({
            filter: filter as { status?: 'read' | 'unread'; tags?: string[] },
          });
        },
      },
      {
        id: 'inbox-get-messages-from-filter',
        section: 'Inbox',
        title: 'Fetch inbox messages with from filter',
        sdkCall: 'client.inbox.getMessages({ paginationLimit, filter })',
        sourceTest: 'inbox-client.test.ts > should fetch messages with from filter',
        getInputs: () => ({
          paginationLimit: 10,
          filter: {
            status: 'unread',
            from: new Date(Date.now() - 60_000).toISOString(),
          },
        }),
        run: async (client, inputs) => {
          const filter = inputs.filter;
          if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
            throw new Error('JSON inputs must include a filter object with status and from (ISO timestamp).');
          }
          const f = filter as { status?: 'read' | 'unread'; from?: unknown };
          const from =
            typeof f.from === 'string' && f.from.trim() !== ''
              ? f.from.trim()
              : null;
          if (!from) {
            throw new Error('filter.from must be a non-empty ISO 8601 date string.');
          }
          return await client.inbox.getMessages({
            paginationLimit: inputNumber(inputs, 'paginationLimit', 10),
            filter: {
              status: f.status ?? 'unread',
              from,
            },
          });
        },
      },
      {
        id: 'inbox-get-archived-messages',
        section: 'Inbox',
        title: 'Fetch archived messages',
        sdkCall: 'client.inbox.getArchivedMessages({ paginationLimit })',
        sourceTest: 'inbox-client.test.ts > should fetch archived messages',
        getInputs: () => ({
          paginationLimit: 10,
        }),
        run: async (client, inputs) => {
          return await client.inbox.getArchivedMessages({
            paginationLimit: inputNumber(inputs, 'paginationLimit', 10),
          });
        },
      },
      {
        id: 'inbox-get-unread-message-count',
        section: 'Inbox',
        title: 'Get unread message count',
        sdkCall: 'client.inbox.getUnreadMessageCount()',
        sourceTest: 'inbox-client.test.ts > should return unread message count',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void _inputs;
          return await client.inbox.getUnreadMessageCount();
        },
      },
      {
        id: 'inbox-get-unread-counts',
        section: 'Inbox',
        title: 'Get unread counts for multiple filters',
        sdkCall: 'client.inbox.getUnreadCounts(filtersMap)',
        sourceTest: 'inbox-client.test.ts > should get unread counts for multiple filters',
        getInputs: () => ({
          filtersMap: {
            'all-messages': {},
            'unread-messages': { status: 'unread' },
            'read-messages': { status: 'read' },
            'tagged-messages': { tags: ['my-tag'] },
            'unread-tagged': { status: 'unread', tags: ['my-tag'] },
          },
        }),
        run: async (client, inputs) => {
          const filtersMap = inputs.filtersMap;
          if (!filtersMap || typeof filtersMap !== 'object' || Array.isArray(filtersMap)) {
            throw new Error('JSON inputs must include a filtersMap object.');
          }
          return await client.inbox.getUnreadCounts(
            filtersMap as Record<string, { status?: 'read' | 'unread'; tags?: string[] }>,
          );
        },
      },
      {
        id: 'inbox-click',
        section: 'Inbox',
        title: 'Track click event',
        sdkCall: 'client.inbox.click({ messageId, trackingId })',
        sourceTest: 'inbox-client.test.ts > should track click events',
        getInputs: () => ({
          messageId: 'from latest message with tracking ID',
          trackingId: 'from latest message with tracking ID',
        }),
        run: async (client, inputs) => {
          const mid = inputs.messageId;
          const tid = inputs.trackingId;
          if (isExplicitMessageId(mid) && isExplicitMessageId(tid)) {
            return await client.inbox.click({
              messageId: mid,
              trackingId: tid,
            });
          }
          const messageContext = await getFirstTrackableInboxMessage(
            client,
            inputNumber(inputs, 'paginationLimit', 20),
          );
          return await client.inbox.click({
            messageId: messageContext.messageId,
            trackingId: messageContext.trackingId,
          });
        },
      },
      {
        id: 'inbox-read',
        section: 'Inbox',
        title: 'Mark message as read',
        sdkCall: 'client.inbox.read({ messageId })',
        sourceTest: 'inbox-client.test.ts > should mark message as read',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client, inputs) => {
          const mid = inputs.messageId;
          if (isExplicitMessageId(mid)) {
            return await client.inbox.read({ messageId: mid });
          }
          const messageContext = await getFirstInboxMessage(
            client,
            inputNumber(inputs, 'paginationLimit', 10),
          );
          return await client.inbox.read({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-unread',
        section: 'Inbox',
        title: 'Mark message as unread',
        sdkCall: 'client.inbox.unread({ messageId })',
        sourceTest: 'inbox-client.test.ts > should mark message as unread',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client, inputs) => {
          const mid = inputs.messageId;
          if (isExplicitMessageId(mid)) {
            return await client.inbox.unread({ messageId: mid });
          }
          const messageContext = await getFirstInboxMessage(
            client,
            inputNumber(inputs, 'paginationLimit', 10),
          );
          return await client.inbox.unread({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-read-all',
        section: 'Inbox',
        title: 'Mark all messages as read',
        sdkCall: 'client.inbox.readAll()',
        sourceTest: 'inbox-client.test.ts > should mark all messages as read',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void _inputs;
          return await client.inbox.readAll();
        },
      },
      {
        id: 'inbox-open',
        section: 'Inbox',
        title: 'Mark message as opened',
        sdkCall: 'client.inbox.open({ messageId })',
        sourceTest: 'inbox-client.test.ts > should mark message as opened',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client, inputs) => {
          const mid = inputs.messageId;
          if (isExplicitMessageId(mid)) {
            return await client.inbox.open({ messageId: mid });
          }
          const messageContext = await getFirstInboxMessage(
            client,
            inputNumber(inputs, 'paginationLimit', 10),
          );
          return await client.inbox.open({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-archive',
        section: 'Inbox',
        title: 'Archive message',
        sdkCall: 'client.inbox.archive({ messageId })',
        sourceTest: 'inbox-client.test.ts > should archive message',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client, inputs) => {
          const mid = inputs.messageId;
          if (isExplicitMessageId(mid)) {
            return await client.inbox.archive({ messageId: mid });
          }
          const messageContext = await getFirstInboxMessage(
            client,
            inputNumber(inputs, 'paginationLimit', 10),
          );
          return await client.inbox.archive({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-archive-read',
        section: 'Inbox',
        title: 'Archive read messages',
        sdkCall: 'client.inbox.archiveRead()',
        sourceTest: 'inbox-client.test.ts > should archive read messages',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void _inputs;
          return await client.inbox.archiveRead();
        },
      },
      {
        id: 'inbox-unarchive',
        section: 'Inbox',
        title: 'Unarchive message',
        sdkCall: 'client.inbox.unarchive({ messageId })',
        sourceTest: 'inbox-client.test.ts > should archive unread messages',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client, inputs) => {
          const mid = inputs.messageId;
          if (isExplicitMessageId(mid)) {
            return await client.inbox.unarchive({ messageId: mid });
          }
          const messageContext = await getFirstInboxMessage(
            client,
            inputNumber(inputs, 'paginationLimit', 10),
          );
          return await client.inbox.unarchive({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-socket-connect-disconnect',
        section: 'Inbox',
        title: 'Connect and disconnect inbox socket',
        sdkCall: 'client.inbox.socket.connect() / .close()',
        sourceTest: 'inbox-client.test.ts > Connect to inbox socket',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void _inputs;
          const socket = client.inbox.socket;
          const wasOpenBefore = socket.isOpen;
          await socket.connect();
          const wasOpenAfterConnect = socket.isOpen;
          socket.sendSubscribe();
          socket.close();
          await sleep(300);

          return {
            wasOpenBefore,
            wasOpenAfterConnect,
            isOpenAfterClose: socket.isOpen,
          };
        },
      },
      {
        id: 'inbox-tenant-messages',
        section: 'Inbox',
        title: 'Fetch tenant inbox messages',
        sdkCall: 'client.inbox.getMessages({ paginationLimit })',
        sourceTest: 'inbox-client.test.ts > should see tenant messages with new client',
        getInputs: () => ({
          paginationLimit: 10,
        }),
        run: async (client, inputs) => {
          if (!client.options.tenantId) {
            return {
              skipped: true,
              reason: 'Current session is not signed in with a tenantId.',
            };
          }

          return await client.inbox.getMessages({
            paginationLimit: inputNumber(inputs, 'paginationLimit', 10),
          });
        },
      },
      {
        id: 'inbox-socket-events',
        section: 'Inbox',
        title: 'Listen for socket events',
        sdkCall: 'client.inbox.socket.addMessageEventListener(cb)',
        sourceTest: 'inbox-client.test.ts > testing socket events',
        getInputs: () => ({
          waitMs: 1000,
        }),
        run: async (client, inputs) => {
          const socket = client.inbox.socket;
          const events: unknown[] = [];
          const removeListener = socket.addMessageEventListener((envelope) => {
            events.push(envelope);
          });

          await socket.connect();
          socket.sendSubscribe();
          await sleep(inputNumber(inputs, 'waitMs', 1000));
          socket.close();
          removeListener();

          return {
            eventCount: events.length,
            events,
          };
        },
      },
      {
        id: 'lists-put-subscription',
        section: 'Lists',
        title: 'Put list subscription',
        sdkCall: 'client.lists.putSubscription({ listId })',
        sourceTest: 'lists-client.test.ts > should put subscription successfully',
        sourceSkipped: true,
        getInputs: () => ({
          listId: LIST_TEST_ID,
        }),
        run: async (client, inputs) => {
          return await client.lists.putSubscription({
            listId: inputString(inputs, 'listId'),
          });
        },
      },
      {
        id: 'lists-delete-subscription',
        section: 'Lists',
        title: 'Delete list subscription',
        sdkCall: 'client.lists.deleteSubscription({ listId })',
        sourceTest: 'lists-client.test.ts > should delete subscription successfully',
        sourceSkipped: true,
        getInputs: () => ({
          listId: LIST_TEST_ID,
        }),
        run: async (client, inputs) => {
          return await client.lists.deleteSubscription({
            listId: inputString(inputs, 'listId'),
          });
        },
      },
      {
        id: 'tokens-put-user-token',
        section: 'Tokens',
        title: 'Store user token',
        sdkCall: 'client.tokens.putUserToken({ token, provider, device })',
        sourceTest: 'token-client.test.ts > should store token successfully',
        getInputs: () => ({
          token: `designer-put-token-${Date.now()}`,
          provider: 'test-provider',
          device: {
            appId: 'test-app-id',
            adId: 'test-ad-id',
            deviceId: 'test-device-id',
            platform: 'test-platform',
            manufacturer: 'test-manufacturer',
            model: 'test-model',
          },
        }),
        run: async (client, inputs) => {
          return await client.tokens.putUserToken({
            token: inputString(inputs, 'token'),
            provider: inputString(inputs, 'provider', 'test-provider') || 'test-provider',
            device:
              inputs.device && typeof inputs.device === 'object' && !Array.isArray(inputs.device)
                ? (inputs.device as { appId?: string; adId?: string; deviceId?: string; platform?: string; manufacturer?: string; model?: string })
                : undefined,
          });
        },
      },
      {
        id: 'tokens-delete-user-token',
        section: 'Tokens',
        title: 'Delete user token',
        sdkCall: 'client.tokens.deleteUserToken({ token })',
        sourceTest: 'token-client.test.ts > should delete token successfully',
        getInputs: () => ({
          token: `designer-delete-token-${Date.now()}`,
        }),
        run: async (client, inputs) => {
          const token = inputString(inputs, 'token');
          await client.tokens.putUserToken({
            token,
            provider: 'test-provider',
          });
          return await client.tokens.deleteUserToken({
            token,
          });
        },
      },
      {
        id: 'tracking-post-inbound-courier',
        section: 'Tracking',
        title: 'Post inbound courier tracking event',
        sdkCall: 'client.tracking.postInboundCourier({ clientKey, event, messageId, type, properties })',
        sourceTest: 'tracking-client.test.ts > should post inbound courier successfully',
        sourceSkipped: true,
        getInputs: () => ({
          clientKey: resolvedClientKey || '',
          event: 'test_event',
          messageId: crypto.randomUUID(),
          type: 'track',
          properties: { source: 'inbox-demo-designer' },
        }),
        run: async (client, inputs) => {
          return await client.tracking.postInboundCourier({
            clientKey: inputString(inputs, 'clientKey'),
            event: inputString(inputs, 'event', 'test_event') || 'test_event',
            messageId: inputString(inputs, 'messageId', '') || crypto.randomUUID(),
            type: (inputString(inputs, 'type', 'track') || 'track') as 'track',
            properties:
              inputs.properties && typeof inputs.properties === 'object' && !Array.isArray(inputs.properties)
                ? (inputs.properties as Record<string, unknown>)
                : undefined,
          });
        },
      },
      {
        id: 'tracking-post-tracking-url',
        section: 'Tracking',
        title: 'Post tracking URL event',
        sdkCall: 'client.tracking.postTrackingUrl({ url, event })',
        sourceTest: 'tracking-client.test.ts > should post tracking url successfully',
        getInputs: () => ({
          url: TRACKING_TEST_URL,
          event: 'CLICKED',
        }),
        run: async (client, inputs) => {
          const url = inputString(inputs, 'url', TRACKING_TEST_URL) || TRACKING_TEST_URL;
          return await client.tracking.postTrackingUrl({
            url,
            event: (inputString(inputs, 'event', 'CLICKED') || 'CLICKED') as CourierTrackingEvent,
          });
        },
      },
      {
        id: 'shared-auth-listeners',
        section: 'Shared',
        title: 'Notify auth listeners on sign in/out',
        sdkCall: 'courier.shared.addAuthenticationListener(cb)',
        sourceTest: 'shared-instance.test.ts > should notify auth listeners when signing in and out',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void client;
          void _inputs;
          const restoreProps = createRestoreProps();
          const testUserId = `shared-auth-test-${crypto.randomUUID()}`;
          const snapshots: Array<{ userId?: string }> = [];

          try {
            const listener = courier.shared.addAuthenticationListener((props) => {
              snapshots.push({ userId: props.userId });
            });

            courier.shared.signIn({ userId: testUserId });
            courier.shared.signOut();
            listener.remove();

            return {
              testUserId,
              snapshots,
            };
          } finally {
            restoreSharedClient(restoreProps);
          }
        },
      },
      {
        id: 'shared-active-message-listeners',
        section: 'Shared',
        title: 'Only active socket listeners receive events',
        sdkCall: 'socket.addMessageEventListener(cb)',
        sourceTest: 'shared-instance.test.ts > should only call active listeners when message is received',
        getInputs: () => ({}),
        run: async (client, _inputs) => {
          void client;
          void _inputs;
          const restoreProps = createRestoreProps();
          const user1 = `shared-listener-1-${crypto.randomUUID()}`;
          const user2 = `shared-listener-2-${crypto.randomUUID()}`;
          let listener1Calls = 0;
          let listener2Calls = 0;

          try {
            courier.shared.signIn({ userId: user1 });
            const socket1 = courier.shared.client?.inbox.socket;
            if (!socket1) {
              throw new Error('Unable to initialize first inbox socket.');
            }
            socket1.addMessageEventListener(() => {
              listener1Calls += 1;
            });

            courier.shared.signIn({ userId: user2 });
            const socket2 = courier.shared.client?.inbox.socket;
            if (!socket2) {
              throw new Error('Unable to initialize second inbox socket.');
            }
            socket2.addMessageEventListener(() => {
              listener2Calls += 1;
            });

            const triggerMessageEvent = socket2.onMessageReceived as (
              event: { event: string; data: { messageId: string; created: string } }
            ) => Promise<void>;

            await triggerMessageEvent({
              event: 'message',
              data: {
                messageId: 'shared-test-message',
                created: new Date().toISOString(),
              },
            });

            return {
              socketInstancesMatch: socket1 === socket2,
              listener1Calls,
              listener2Calls,
            };
          } finally {
            restoreSharedClient(restoreProps);
          }
        },
      },
  ];

  const sectionOrder = ['Client', 'Brands', 'Preferences', 'Inbox', 'Lists', 'Tokens', 'Tracking', 'Shared'];
  const groupedTests = new Map<string, CourierTestDefinition[]>();

  for (const test of tests) {
    const current = groupedTests.get(test.section) ?? [];
    current.push(test);
    groupedTests.set(test.section, current);
  }

  const testsBySection = sectionOrder
    .filter((section) => groupedTests.has(section))
    .map((section) => ({
      section,
      tests: groupedTests.get(section) ?? [],
    }));

  const defaultsKey = `${userId}|${resolvedBrandId}|${resolvedTopicId}|${resolvedClientKey}`;
  useEffect(() => {
    setInputDrafts({});
  }, [defaultsKey]);

  const runTest = async (test: CourierTestDefinition) => {
    const draft = inputDrafts[test.id] ?? toJson(test.getInputs());

    setTestResults((previous) => {
      const prev = previous[test.id];
      return {
        ...previous,
        [test.id]: {
          isLoading: true,
          output: prev?.output ?? null,
          lastRunAt: prev?.lastRunAt,
          outcome: prev?.outcome ?? 'idle',
        },
      };
    });

    let parsed: Record<string, unknown>;
    try {
      const raw = JSON.parse(draft);
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error('Inputs must be a JSON object.');
      }
      parsed = raw as Record<string, unknown>;
    } catch (e) {
      setTestResults((previous) => ({
        ...previous,
        [test.id]: {
          isLoading: false,
          output: String(e),
          lastRunAt: new Date().toISOString(),
          outcome: 'error',
        },
      }));
      return;
    }

    try {
      const client = getClient();
      const output = await test.run(client, parsed);

      setTestResults((previous) => ({
        ...previous,
        [test.id]: {
          isLoading: false,
          output: output === undefined ? null : output,
          lastRunAt: new Date().toISOString(),
          outcome: 'success',
        },
      }));
    } catch (error) {
      setTestResults((previous) => ({
        ...previous,
        [test.id]: {
          isLoading: false,
          output: String(error),
          lastRunAt: new Date().toISOString(),
          outcome: 'error',
        },
      }));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-6">
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Courier JS Tests</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each test maps to the courier-js test suite and runs through the courier-react recommended access path
                (<span className="font-mono">useCourier().shared.client</span>).
              </p>
            </div>
            <Select value={testEnv} onValueChange={(v) => handleTestEnvChange(v as TestApiEnvironment)}>
              <SelectTrigger className="w-[140px] shrink-0 font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TEST_ENV_LABELS) as TestApiEnvironment[]).map((env) => (
                  <SelectItem key={env} value={env}>
                    {TEST_ENV_LABELS[env]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {testsBySection.map((sectionGroup) => (
          <section key={sectionGroup.section} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{sectionGroup.section}</h3>
              <Badge variant="secondary">{sectionGroup.tests.length} tests</Badge>
            </div>

            <div className="space-y-3">
              {sectionGroup.tests.map((test, testIndex) => {
                const testResult = testResults[test.id];
                const outcome = testResult?.outcome ?? 'idle';
                const defaultInputJson = toJson(test.getInputs());
                const inputValue = inputDrafts[test.id] ?? defaultInputJson;
                const isRunning = Boolean(testResult?.isLoading);
                const innerRadius =
                  'max(6px, calc(var(--test-card-radius) - var(--test-card-pad)))';

                const testBadgeClass =
                  outcome === 'success'
                    ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                    : outcome === 'error'
                      ? 'border-destructive/50 bg-destructive/10 text-destructive'
                      : 'border-muted-foreground/30 bg-muted/40 text-muted-foreground';

                return (
                  <Card
                    key={test.id}
                    className="border"
                    style={
                      {
                        '--test-card-radius': '14px',
                        '--test-card-pad': '12px',
                        borderRadius: 'var(--test-card-radius)',
                      } as CSSProperties
                    }
                  >
                    <CardHeader
                      className="p-[var(--test-card-pad)] pb-3"
                      style={{ borderRadius: 'var(--test-card-radius)' }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={`${testBadgeClass} gap-1`}>
                              {outcome === 'success' && <Check className="size-3.5" aria-hidden />}
                              {outcome === 'error' && <X className="size-3.5" aria-hidden />}
                              Test {testIndex + 1}
                            </Badge>
                            <CardTitle className="text-sm">{test.title}</CardTitle>
                            {test.sourceSkipped && <Badge variant="outline">Skipped in courier-js</Badge>}
                          </div>
                          <pre
                            className="m-0 w-fit cursor-text whitespace-pre rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground"
                            style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
                          >
                            {test.sdkCall}
                          </pre>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => runTest(test)}
                            disabled={isRunning}
                            className="h-8 gap-1 px-2.5 text-xs has-[>svg]:px-2"
                          >
                            {isRunning ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden />
                            ) : (
                              <Play className="size-3.5" aria-hidden />
                            )}
                            {isRunning ? 'Running…' : 'Run Test'}
                          </Button>
                          {testResult?.lastRunAt && (
                            <p className="text-[11px] text-muted-foreground">
                              Last run: {new Date(testResult.lastRunAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent
                      className="p-[var(--test-card-pad)] pt-0"
                      style={{ borderRadius: 'var(--test-card-radius)' }}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <div
                          className="min-w-0 border border-border/80 bg-muted/20 p-3 font-mono"
                          style={{ borderRadius: innerRadius }}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Inputs
                            </p>
                            <button
                              type="button"
                              className="text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="Copy input JSON"
                              onClick={() => copyPanel(`${test.id}:input`, inputValue)}
                            >
                              {copiedPanel === `${test.id}:input` ? (
                                <Check className="size-3.5 text-green-600 dark:text-green-400" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </button>
                          </div>
                          {Object.keys(test.getInputs()).length === 0 ? (
                            <p className="text-xs text-muted-foreground">No explicit inputs (empty JSON object).</p>
                          ) : null}
                          <TestJsonEditor
                            value={inputValue}
                            readOnly={false}
                            disabled={isRunning}
                            onChange={(v) =>
                              setInputDrafts((prev) => ({
                                ...prev,
                                [test.id]: v,
                              }))
                            }
                            className="border-0 bg-transparent"
                          />
                        </div>

                        <div
                          className="min-w-0 border border-border/80 p-3 font-mono"
                          style={{ borderRadius: innerRadius }}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Output
                              </p>
                              {isRunning && (
                                <Badge variant="secondary" className="text-[10px]">
                                  Loading
                                </Badge>
                              )}
                            </div>
                            {testResult && (
                              <button
                                type="button"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Copy output JSON"
                                onClick={() =>
                                  copyPanel(`${test.id}:output`, toJson(testResult.output))
                                }
                              >
                                {copiedPanel === `${test.id}:output` ? (
                                  <Check className="size-3.5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          {testResult ? (
                            <TestJsonEditor
                              value={toJson(testResult.output)}
                              readOnly
                              disabled={false}
                              className="border-0 bg-transparent"
                            />
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Run this test to view the full JSON response.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
