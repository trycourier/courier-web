import { CourierClient } from "../client/courier-client";

const CLIENT_ENV_KEYS = [
  'USER_ID',
  'JWT',
  'COURIER_REST_URL',
  'COURIER_GRAPHQL_URL',
  'INBOX_GRAPHQL_URL',
  'INBOX_WEBSOCKET_URL',
] as const;

export const hasTestEnv = (...keys: readonly string[]) =>
  keys.every((key) => Boolean(process.env[key]));

export const hasClientTestEnv = () => hasTestEnv(...CLIENT_ENV_KEYS);

export function getClient(tenantId?: string) {
  return new CourierClient({
    showLogs: false,
    userId: process.env.USER_ID!,
    jwt: process.env.JWT!,
    tenantId: tenantId,
    apiUrls: {
      courier: {
        rest: process.env.COURIER_REST_URL!,
        graphql: process.env.COURIER_GRAPHQL_URL!
      },
      inbox: {
        graphql: process.env.INBOX_GRAPHQL_URL!,
        webSocket: process.env.INBOX_WEBSOCKET_URL!
      }
    },
  });
}
