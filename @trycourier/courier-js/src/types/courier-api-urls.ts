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

export type CourierApiRegion = 'us' | 'eu';

const freezeCourierApiUrls = (urls: CourierApiUrls): Readonly<CourierApiUrls> => Object.freeze({
  courier: Object.freeze({
    ...urls.courier,
  }),
  inbox: Object.freeze({
    ...urls.inbox,
  }),
});

const cloneCourierApiUrls = (urls: CourierApiUrls): CourierApiUrls => ({
  courier: {
    ...urls.courier,
  },
  inbox: {
    ...urls.inbox,
  },
});

const COURIER_API_URLS_BY_REGION: Record<CourierApiRegion, Readonly<CourierApiUrls>> = {
  us: freezeCourierApiUrls({
    courier: {
      rest: 'https://api.courier.com',
      graphql: 'https://api.courier.com/client/q',
    },
    inbox: {
      graphql: 'https://inbox.courier.com/q',
      webSocket: 'wss://realtime.courier.io'
    }
  }),
  eu: freezeCourierApiUrls({
    courier: {
      rest: 'https://api.eu.courier.com',
      graphql: 'https://api.eu.courier.com/client/q',
    },
    inbox: {
      graphql: 'https://inbox.eu.courier.io/q',
      webSocket: 'wss://realtime.eu.courier.io'
    }
  }),
};

export const DEFAULT_COURIER_API_URLS = COURIER_API_URLS_BY_REGION.us;
export const EU_COURIER_API_URLS = COURIER_API_URLS_BY_REGION.eu;

export const getCourierApiUrlsForRegion = (region: CourierApiRegion = 'us'): CourierApiUrls =>
  cloneCourierApiUrls(COURIER_API_URLS_BY_REGION[region]);

export const getCourierApiUrls = (urls?: CourierApiUrls): CourierApiUrls => {
  const defaultUrls = DEFAULT_COURIER_API_URLS;

  return {
    courier: {
      rest: urls?.courier.rest || defaultUrls.courier.rest,
      graphql: urls?.courier.graphql || defaultUrls.courier.graphql,
    },
    inbox: {
      graphql: urls?.inbox.graphql || defaultUrls.inbox.graphql,
      webSocket: urls?.inbox.webSocket || defaultUrls.inbox.webSocket
    }
  };
};
