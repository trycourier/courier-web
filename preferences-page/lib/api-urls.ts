import { type CourierApiUrls } from "@trycourier/courier-react";
import type { CourierEnv } from "./types";

/**
 * Maps the hosted-page environment (decoded from the URL) to the full set of
 * Courier API URLs expected by `courier.shared.signIn({ apiUrls })`.
 *
 * Ported from `designer/app/lib/api-urls.ts`, trimmed to the three environments
 * the preferences page supports (production | staging | dev). The preferences
 * component only talks to the `courier` REST/GraphQL endpoints, but `inbox`
 * URLs are required by the `CourierApiUrls` shape, so we keep the presets whole.
 */
const API_URL_PRESETS: Record<CourierEnv, CourierApiUrls> = {
  production: {
    courier: {
      rest: "https://api.courier.com",
      graphql: "https://api.courier.com/client/q",
    },
    inbox: {
      graphql: "https://inbox.courier.com/q",
      webSocket: "wss://realtime.courier.io",
    },
  },
  staging: {
    courier: {
      rest: "https://api.staging-trycourier.com",
      graphql:
        "https://yubmnstah4.execute-api.us-east-1.amazonaws.com/staging/client/q",
    },
    inbox: {
      graphql:
        "https://4rq7n8hhjd.execute-api.us-east-1.amazonaws.com/staging/q",
      webSocket:
        "http://inbox-staging-ws-alb-490231599.us-east-1.elb.amazonaws.com",
    },
  },
  dev: {
    courier: {
      rest: "https://api.courierdev.com",
      graphql: "https://api.courierdev.com/client/q",
    },
    inbox: {
      graphql: "https://inbox.courierdev.com/q",
      webSocket: "wss://9mrugsdnk1.execute-api.us-east-1.amazonaws.com/dev",
    },
  },
};

export function getApiUrls(env: CourierEnv): CourierApiUrls {
  const preset = API_URL_PRESETS[env] ?? API_URL_PRESETS.production;
  return {
    courier: { ...preset.courier },
    inbox: { ...preset.inbox },
  };
}
