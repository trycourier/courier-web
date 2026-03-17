import {
  type CourierApiRegion,
  type CourierApiUrls,
  getCourierApiUrlsForRegion
} from '@trycourier/courier-react';

type SearchParamsLike = {
  get(name: string): string | null;
};

export const DEFAULT_API_REGION: CourierApiRegion = 'us';

export const resolveApiRegion = (value: string | null): CourierApiRegion =>
  value === 'eu' ? 'eu' : DEFAULT_API_REGION;

export const areApiUrlsEqual = (left: CourierApiUrls, right: CourierApiUrls): boolean =>
  left.courier.rest === right.courier.rest &&
  left.courier.graphql === right.courier.graphql &&
  left.inbox.graphql === right.inbox.graphql &&
  left.inbox.webSocket === right.inbox.webSocket;

export const getApiUrlsFromSearchParams = (searchParams: SearchParamsLike): {
  apiRegion: CourierApiRegion;
  presetApiUrls: CourierApiUrls;
  apiUrls: CourierApiUrls;
} => {
  const apiRegion = resolveApiRegion(searchParams.get('apiRegion'));
  const presetApiUrls = getCourierApiUrlsForRegion(apiRegion);

  return {
    apiRegion,
    presetApiUrls,
    apiUrls: {
      courier: {
        rest: searchParams.get('courierRest') || presetApiUrls.courier.rest,
        graphql: searchParams.get('courierGraphql') || presetApiUrls.courier.graphql,
      },
      inbox: {
        graphql: searchParams.get('inboxGraphql') || presetApiUrls.inbox.graphql,
        webSocket: searchParams.get('inboxWebSocket') || presetApiUrls.inbox.webSocket,
      },
    },
  };
};
