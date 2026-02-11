'use client';

import { useState } from 'react';
import { useCourier } from '@trycourier/courier-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CourierTestsTabProps {
  userId: string;
  brandId?: string;
  topicId?: string;
  clientKey?: string;
}

type CourierClientInstance = NonNullable<ReturnType<typeof useCourier>['shared']['client']>;

interface TestResultState {
  isLoading: boolean;
  output: unknown;
  lastRunAt?: string;
  error?: string | null;
}

interface CourierTestDefinition {
  id: string;
  section: string;
  title: string;
  sourceTest: string;
  sourceSkipped?: boolean;
  getInputs: () => Record<string, unknown>;
  run: (client: CourierClientInstance) => Promise<unknown>;
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

function formatInputValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return value.length > 0 ? value : '(empty)';
  }

  return JSON.stringify(value);
}

function normalizeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? null,
    };
  }

  return {
    message: String(error),
  };
}

export function CourierTestsTab({ userId, brandId, topicId, clientKey }: CourierTestsTabProps) {
  const courier = useCourier();
  const [testResults, setTestResults] = useState<Record<string, TestResultState>>({});

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

  const requireValue = (value: string, label: string): string => {
    if (!value.trim()) {
      throw new Error(`${label} is required. Add it in the Advanced tab and save/reload.`);
    }
    return value.trim();
  };

  const getFirstInboxMessage = async (client: CourierClientInstance) => {
    const response = await client.inbox.getMessages({ paginationLimit: 10 });
    const message = response.data?.messages?.nodes?.[0];
    if (!message?.messageId) {
      throw new Error('No inbox message found. Send a test message first.');
    }

    return {
      response,
      messageId: message.messageId,
    };
  };

  const getFirstTrackableInboxMessage = async (client: CourierClientInstance) => {
    const response = await client.inbox.getMessages({ paginationLimit: 20 });
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
        sourceTest: 'courier-client.test.ts > should validate client initialization with all options',
        getInputs: () => ({
          userId,
          signedInClient: true,
        }),
        run: async (client) => {
          const options = client.options;
          return {
            userId: options.userId,
            hasJwt: Boolean(options.jwt),
            hasPublicApiKey: Boolean(options.publicApiKey),
            connectionId: options.connectionId,
            tenantId: options.tenantId ?? null,
            showLogs: options.showLogs,
            apiUrls: options.apiUrls,
            courierUserAgent: options.courierUserAgent.getUserAgentInfo(),
          };
        },
      },
      {
        id: 'courier-client-minimal-options',
        section: 'Client',
        title: 'Validate minimal shared client requirements',
        sourceTest: 'courier-client.test.ts > should validate client initialization with minimal options',
        getInputs: () => ({
          userId,
          expectedShowLogsDefault: false,
        }),
        run: async (client) => {
          const options = client.options;
          return {
            userId: options.userId,
            hasUserAgent: Boolean(options.courierUserAgent),
            hasAuthToken: Boolean(options.jwt || options.publicApiKey),
            showLogsDefaultLikeCourierJs: options.showLogs === false,
          };
        },
      },
      {
        id: 'brand-get-brand',
        section: 'Brands',
        title: 'Fetch brand settings',
        sourceTest: 'brand-client.test.ts > should fetch brand settings successfully',
        getInputs: () => ({
          brandId: resolvedBrandId || '(missing)',
        }),
        run: async (client) => {
          return await client.brands.getBrand({
            brandId: requireValue(resolvedBrandId, 'brandId'),
          });
        },
      },
      {
        id: 'preferences-get-user-preferences',
        section: 'Preferences',
        title: 'Fetch all user preferences',
        sourceTest: 'preferences-client.test.ts > should fetch user preferences successfully',
        getInputs: () => ({
          userId,
        }),
        run: async (client) => {
          return await client.preferences.getUserPreferences();
        },
      },
      {
        id: 'preferences-get-topic',
        section: 'Preferences',
        title: 'Fetch user preference topic',
        sourceTest: 'preferences-client.test.ts > should fetch user preference topic successfully',
        getInputs: () => ({
          topicId: resolvedTopicId || '(missing)',
        }),
        run: async (client) => {
          return await client.preferences.getUserPreferenceTopic({
            topicId: requireValue(resolvedTopicId, 'topicId'),
          });
        },
      },
      {
        id: 'preferences-put-topic',
        section: 'Preferences',
        title: 'Update user preference topic',
        sourceTest: 'preferences-client.test.ts > should update user preference topic successfully',
        getInputs: () => ({
          topicId: resolvedTopicId || '(missing)',
          status: 'OPTED_IN',
          hasCustomRouting: false,
          customRouting: [],
        }),
        run: async (client) => {
          return await client.preferences.putUserPreferenceTopic({
            topicId: requireValue(resolvedTopicId, 'topicId'),
            status: 'OPTED_IN',
            hasCustomRouting: false,
            customRouting: [],
          });
        },
      },
      {
        id: 'preferences-notification-center-url',
        section: 'Preferences',
        title: 'Get notification center URL',
        sourceTest: 'preferences-client.test.ts > should get notification center url successfully',
        getInputs: () => ({
          clientKey: resolvedClientKey || '(missing)',
          userId,
        }),
        run: async (client) => {
          return client.preferences.getNotificationCenterUrl({
            clientKey: requireValue(resolvedClientKey, 'clientKey'),
          });
        },
      },
      {
        id: 'inbox-get-messages',
        section: 'Inbox',
        title: 'Fetch inbox messages',
        sourceTest: 'inbox-client.test.ts > should fetch messages and unread count',
        getInputs: () => ({
          paginationLimit: 10,
        }),
        run: async (client) => {
          return await client.inbox.getMessages({
            paginationLimit: 10,
          });
        },
      },
      {
        id: 'inbox-get-messages-with-filters',
        section: 'Inbox',
        title: 'Fetch inbox messages with filters',
        sourceTest: 'inbox-client.test.ts > should fetch messages with filters',
        getInputs: () => ({
          filter: {
            status: 'unread',
            tags: ['my-tag'],
          },
        }),
        run: async (client) => {
          return await client.inbox.getMessages({
            filter: {
              status: 'unread',
              tags: ['my-tag'],
            },
          });
        },
      },
      {
        id: 'inbox-get-archived-messages',
        section: 'Inbox',
        title: 'Fetch archived messages',
        sourceTest: 'inbox-client.test.ts > should fetch archived messages',
        getInputs: () => ({
          paginationLimit: 10,
        }),
        run: async (client) => {
          return await client.inbox.getArchivedMessages({
            paginationLimit: 10,
          });
        },
      },
      {
        id: 'inbox-get-unread-message-count',
        section: 'Inbox',
        title: 'Get unread message count',
        sourceTest: 'inbox-client.test.ts > should return unread message count',
        getInputs: () => ({
          userId,
        }),
        run: async (client) => {
          return await client.inbox.getUnreadMessageCount();
        },
      },
      {
        id: 'inbox-get-unread-counts',
        section: 'Inbox',
        title: 'Get unread counts for multiple filters',
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
        run: async (client) => {
          return await client.inbox.getUnreadCounts({
            'all-messages': {},
            'unread-messages': { status: 'unread' },
            'read-messages': { status: 'read' },
            'tagged-messages': { tags: ['my-tag'] },
            'unread-tagged': { status: 'unread', tags: ['my-tag'] },
          });
        },
      },
      {
        id: 'inbox-click',
        section: 'Inbox',
        title: 'Track click event',
        sourceTest: 'inbox-client.test.ts > should track click events',
        getInputs: () => ({
          messageId: 'from latest message with tracking ID',
          trackingId: 'from latest message with tracking ID',
        }),
        run: async (client) => {
          const messageContext = await getFirstTrackableInboxMessage(client);
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
        sourceTest: 'inbox-client.test.ts > should mark message as read',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client) => {
          const messageContext = await getFirstInboxMessage(client);
          return await client.inbox.read({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-unread',
        section: 'Inbox',
        title: 'Mark message as unread',
        sourceTest: 'inbox-client.test.ts > should mark message as unread',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client) => {
          const messageContext = await getFirstInboxMessage(client);
          return await client.inbox.unread({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-read-all',
        section: 'Inbox',
        title: 'Mark all messages as read',
        sourceTest: 'inbox-client.test.ts > should mark all messages as read',
        getInputs: () => ({
          appliesToAllMessages: true,
        }),
        run: async (client) => {
          return await client.inbox.readAll();
        },
      },
      {
        id: 'inbox-open',
        section: 'Inbox',
        title: 'Mark message as opened',
        sourceTest: 'inbox-client.test.ts > should mark message as opened',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client) => {
          const messageContext = await getFirstInboxMessage(client);
          return await client.inbox.open({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-archive',
        section: 'Inbox',
        title: 'Archive message',
        sourceTest: 'inbox-client.test.ts > should archive message',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client) => {
          const messageContext = await getFirstInboxMessage(client);
          return await client.inbox.archive({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-archive-read',
        section: 'Inbox',
        title: 'Archive read messages',
        sourceTest: 'inbox-client.test.ts > should archive read messages',
        getInputs: () => ({
          appliesToReadMessages: true,
        }),
        run: async (client) => {
          return await client.inbox.archiveRead();
        },
      },
      {
        id: 'inbox-unarchive',
        section: 'Inbox',
        title: 'Unarchive message',
        sourceTest: 'inbox-client.test.ts > should archive unread messages',
        getInputs: () => ({
          messageId: 'from latest message',
        }),
        run: async (client) => {
          const messageContext = await getFirstInboxMessage(client);
          return await client.inbox.unarchive({
            messageId: messageContext.messageId,
          });
        },
      },
      {
        id: 'inbox-socket-connect-disconnect',
        section: 'Inbox',
        title: 'Connect and disconnect inbox socket',
        sourceTest: 'inbox-client.test.ts > Connect to inbox socket',
        getInputs: () => ({
          operation: 'connect -> subscribe -> close',
        }),
        run: async (client) => {
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
        sourceTest: 'inbox-client.test.ts > should see tenant messages with new client',
        getInputs: () => ({
          tenantId: courier.shared.client?.options.tenantId ?? '(missing)',
          paginationLimit: 10,
        }),
        run: async (client) => {
          if (!client.options.tenantId) {
            return {
              skipped: true,
              reason: 'Current session is not signed in with a tenantId.',
            };
          }

          return await client.inbox.getMessages({
            paginationLimit: 10,
          });
        },
      },
      {
        id: 'inbox-socket-events',
        section: 'Inbox',
        title: 'Listen for socket events',
        sourceTest: 'inbox-client.test.ts > testing socket events',
        getInputs: () => ({
          waitMs: 1000,
          operation: 'connect -> subscribe -> wait -> close',
        }),
        run: async (client) => {
          const socket = client.inbox.socket;
          const events: unknown[] = [];
          const removeListener = socket.addMessageEventListener((envelope) => {
            events.push(envelope);
          });

          await socket.connect();
          socket.sendSubscribe();
          await sleep(1000);
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
        sourceTest: 'lists-client.test.ts > should put subscription successfully',
        sourceSkipped: true,
        getInputs: () => ({
          listId: LIST_TEST_ID,
        }),
        run: async (client) => {
          return await client.lists.putSubscription({
            listId: LIST_TEST_ID,
          });
        },
      },
      {
        id: 'lists-delete-subscription',
        section: 'Lists',
        title: 'Delete list subscription',
        sourceTest: 'lists-client.test.ts > should delete subscription successfully',
        sourceSkipped: true,
        getInputs: () => ({
          listId: LIST_TEST_ID,
        }),
        run: async (client) => {
          return await client.lists.deleteSubscription({
            listId: LIST_TEST_ID,
          });
        },
      },
      {
        id: 'tokens-put-user-token',
        section: 'Tokens',
        title: 'Store user token',
        sourceTest: 'token-client.test.ts > should store token successfully',
        getInputs: () => ({
          provider: 'test-provider',
          token: 'generated per run',
        }),
        run: async (client) => {
          const token = `designer-put-token-${Date.now()}`;
          await client.tokens.putUserToken({
            token,
            provider: 'test-provider',
            device: {
              appId: 'test-app-id',
              adId: 'test-ad-id',
              deviceId: 'test-device-id',
              platform: 'test-platform',
              manufacturer: 'test-manufacturer',
              model: 'test-model',
            },
          });

          return {
            token,
            stored: true,
          };
        },
      },
      {
        id: 'tokens-delete-user-token',
        section: 'Tokens',
        title: 'Delete user token',
        sourceTest: 'token-client.test.ts > should delete token successfully',
        getInputs: () => ({
          workflow: 'create token then delete it',
        }),
        run: async (client) => {
          const token = `designer-delete-token-${Date.now()}`;
          await client.tokens.putUserToken({
            token,
            provider: 'test-provider',
          });
          await client.tokens.deleteUserToken({
            token,
          });

          return {
            token,
            deleted: true,
          };
        },
      },
      {
        id: 'tracking-post-inbound-courier',
        section: 'Tracking',
        title: 'Post inbound courier tracking event',
        sourceTest: 'tracking-client.test.ts > should post inbound courier successfully',
        sourceSkipped: true,
        getInputs: () => ({
          clientKey: resolvedClientKey || '(missing)',
          event: 'test_event',
          type: 'track',
        }),
        run: async (client) => {
          return await client.tracking.postInboundCourier({
            clientKey: requireValue(resolvedClientKey, 'clientKey'),
            event: 'test_event',
            messageId: crypto.randomUUID(),
            type: 'track',
            properties: {
              source: 'inbox-demo-designer',
            },
          });
        },
      },
      {
        id: 'tracking-post-tracking-url',
        section: 'Tracking',
        title: 'Post tracking URL event',
        sourceTest: 'tracking-client.test.ts > should post tracking url successfully',
        getInputs: () => ({
          url: TRACKING_TEST_URL,
          event: 'CLICKED',
        }),
        run: async (client) => {
          return await client.tracking.postTrackingUrl({
            url: TRACKING_TEST_URL,
            event: 'CLICKED',
          });
        },
      },
      {
        id: 'shared-auth-listeners',
        section: 'Shared',
        title: 'Notify auth listeners on sign in/out',
        sourceTest: 'shared-instance.test.ts > should notify auth listeners when signing in and out',
        getInputs: () => ({
          operation: 'add listener -> signIn -> signOut -> restore previous session',
        }),
        run: async () => {
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
        sourceTest: 'shared-instance.test.ts > should only call active listeners when message is received',
        getInputs: () => ({
          operation: 'signIn user1 -> add listener -> signIn user2 -> add listener -> simulate event -> restore',
        }),
        run: async () => {
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

            await socket2.onMessageReceived({
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

  const runTest = async (test: CourierTestDefinition) => {
    setTestResults((previous) => ({
      ...previous,
      [test.id]: {
        ...(previous[test.id] ?? { output: null }),
        isLoading: true,
        error: null,
      },
    }));

    try {
      const client = getClient();
      const output = await test.run(client);

      setTestResults((previous) => ({
        ...previous,
        [test.id]: {
          isLoading: false,
          output: output === undefined ? null : output,
          lastRunAt: new Date().toISOString(),
          error: null,
        },
      }));
    } catch (error) {
      const normalizedError = normalizeError(error);

      setTestResults((previous) => ({
        ...previous,
        [test.id]: {
          isLoading: false,
          output: {
            error: normalizedError,
          },
          lastRunAt: new Date().toISOString(),
          error: String(normalizedError.message ?? 'Unknown error'),
        },
      }));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-6">
        <div className="rounded-lg border bg-muted/20 p-4">
          <h2 className="text-base font-semibold">Courier JS Tests</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each test maps to the courier-js test suite and runs through the courier-react recommended access path
            (<span className="font-mono">useCourier().shared.client</span>).
          </p>
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
                const inputs = test.getInputs();

                return (
                  <Card key={test.id} className="border-2">
                    <CardHeader className="p-4 pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">Test {testIndex + 1}</Badge>
                            <Badge variant="secondary" className="font-mono text-[10px]">
                              {test.id}
                            </Badge>
                            {test.sourceSkipped && <Badge variant="outline">Skipped in courier-js</Badge>}
                          </div>
                          <CardTitle className="text-sm">{test.title}</CardTitle>
                          <CardDescription className="text-xs">{test.sourceTest}</CardDescription>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => runTest(test)}
                            disabled={testResult?.isLoading}
                          >
                            {testResult?.isLoading ? 'Running...' : 'Run Test'}
                          </Button>
                          {testResult?.lastRunAt && (
                            <p className="text-[11px] text-muted-foreground">
                              Last run: {new Date(testResult.lastRunAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-md border bg-muted/20 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inputs</p>
                          <div className="space-y-2">
                            {Object.keys(inputs).length === 0 && (
                              <p className="text-xs text-muted-foreground">No explicit inputs.</p>
                            )}
                            {Object.entries(inputs).map(([key, value]) => (
                              <p key={key} className="break-all font-mono text-xs whitespace-pre-wrap">
                                <span className="font-semibold text-foreground">{key}:</span> {formatInputValue(value)}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-md border p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Output</p>
                            {testResult?.isLoading && (
                              <Badge variant="secondary" className="text-[10px]">
                                Loading
                              </Badge>
                            )}
                            {testResult?.error && (
                              <Badge variant="destructive" className="text-[10px]">
                                Error
                              </Badge>
                            )}
                          </div>

                          {testResult ? (
                            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded bg-muted/30 p-2 font-mono text-xs">
                              {toJson(testResult.output)}
                            </pre>
                          ) : (
                            <p className="text-xs text-muted-foreground">Run this test to view the full JSON response.</p>
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
