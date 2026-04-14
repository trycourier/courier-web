import { CourierClient } from "../client/courier-client";

export function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export function getClient(tenantId?: string) {
  return new CourierClient({
    showLogs: false,
    userId: env('USER_ID'),
    jwt: env('JWT'),
    tenantId: tenantId,
    apiUrls: {
      courier: {
        rest: env('COURIER_REST_URL'),
        graphql: env('COURIER_GRAPHQL_URL'),
      },
      inbox: {
        graphql: env('INBOX_GRAPHQL_URL'),
        webSocket: env('INBOX_WEBSOCKET_URL'),
      },
    },
  });
}
