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

export const getCourierApiUrls = (urls?: CourierApiUrls): CourierApiUrls => ({
  courier: {
    rest: urls?.courier.rest || 'https://api.courier.com',
    graphql: urls?.courier.graphql || 'https://api.courier.com/client/q',
  },
  inbox: {
    graphql: urls?.inbox.graphql || 'https://inbox.courier.com/q',
    webSocket: urls?.inbox.webSocket || 'wss://realtime.courier.io'
  }
});