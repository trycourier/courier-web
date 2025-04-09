import { CourierClient } from "../client/courier-client";

export function getClient() {
  return new CourierClient({
    userId: process.env.USER_ID!,
    publicApiKey: process.env.PUBLIC_API_KEY!,
    jwt: process.env.JWT!,
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
