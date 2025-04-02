import { CourierClientOptions } from "../client/courier-client";

export interface CourierApiUrls {
  courier: {
    rest: string;
    graphql: string;
  },
  inbox: {
    graphql: string;
    webSocket: string;
  }
}

export const getCourierApiUrls = (options?: CourierClientOptions): CourierApiUrls => ({
  courier: {
    rest: options?.apiUrls?.courier.rest || 'https://api.courier.com',
    graphql: options?.apiUrls?.courier.graphql || 'https://api.courier.com/client/q',
  },
  inbox: {
    graphql: options?.apiUrls?.inbox.graphql || 'https://inbox.courier.com/q',
    webSocket: options?.apiUrls?.inbox.webSocket || 'wss://realtime.courier.com'
  }
});