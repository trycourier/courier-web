import { CourierClient } from "../client/courier-client";

export function getClient(tenantId?: string) {
  return new CourierClient({
    userId: process.env.USER_ID!,
    publicApiKey: process.env.PUBLIC_API_KEY,
    jwt: process.env.JWT,
    tenantId: tenantId,
    connectionId: process.env.INBOX_SOCKET_ID,
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
    showLogs: true
  });
}
