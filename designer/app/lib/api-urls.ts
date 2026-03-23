import { type CourierApiUrls } from '@trycourier/courier-react';

type SearchParamsLike = {
  get(name: string): string | null;
};

export type ApiEnvironment = 'production' | 'production-eu' | 'staging' | 'dev' | 'custom';

export const DEFAULT_API_ENVIRONMENT: ApiEnvironment = 'production';

const VALID_ENVIRONMENTS: ApiEnvironment[] = ['production', 'production-eu', 'staging', 'dev', 'custom'];

export const API_ENVIRONMENT_PRESETS: Record<Exclude<ApiEnvironment, 'custom'>, Readonly<CourierApiUrls>> = {
  production: {
    courier: {
      rest: 'https://api.courier.com',
      graphql: 'https://api.courier.com/client/q',
    },
    inbox: {
      graphql: 'https://inbox.courier.com/q',
      webSocket: 'wss://realtime.courier.io',
    },
  },
  'production-eu': {
    courier: {
      rest: 'https://api.eu.courier.com',
      graphql: 'https://api.eu.courier.com/client/q',
    },
    inbox: {
      graphql: 'https://inbox.eu.courier.io/q',
      webSocket: 'wss://realtime.eu.courier.io',
    },
  },
  staging: {
    courier: {
      rest: 'https://api.staging-trycourier.com',
      graphql: 'https://yubmnstah4.execute-api.us-east-1.amazonaws.com/staging/client/q',
    },
    inbox: {
      graphql: 'https://4rq7n8hhjd.execute-api.us-east-1.amazonaws.com/staging/q',
      webSocket: 'http://inbox-staging-ws-alb-490231599.us-east-1.elb.amazonaws.com',
    },
  },
  dev: {
    courier: {
      rest: 'https://api.courierdev.com',
      graphql: 'https://api.courierdev.com/client/q',
    },
    inbox: {
      graphql: 'https://inbox.courierdev.com/q',
      webSocket: 'wss://9mrugsdnk1.execute-api.us-east-1.amazonaws.com/dev',
    },
  },
};

export const resolveApiEnvironment = (value: string | null): ApiEnvironment =>
  value && VALID_ENVIRONMENTS.includes(value as ApiEnvironment)
    ? (value as ApiEnvironment)
    : DEFAULT_API_ENVIRONMENT;

export const getPresetApiUrls = (env: Exclude<ApiEnvironment, 'custom'>): CourierApiUrls => ({
  courier: { ...API_ENVIRONMENT_PRESETS[env].courier },
  inbox: { ...API_ENVIRONMENT_PRESETS[env].inbox },
});

export const areApiUrlsEqual = (left: CourierApiUrls, right: CourierApiUrls): boolean =>
  left.courier.rest === right.courier.rest &&
  left.courier.graphql === right.courier.graphql &&
  left.inbox.graphql === right.inbox.graphql &&
  left.inbox.webSocket === right.inbox.webSocket;

export const getApiUrlsFromSearchParams = (searchParams: SearchParamsLike): {
  apiEnvironment: ApiEnvironment;
  presetApiUrls: CourierApiUrls;
  apiUrls: CourierApiUrls;
} => {
  const envParam = searchParams.get('env');
  const apiEnvironment = resolveApiEnvironment(envParam);

  let presetApiUrls: CourierApiUrls;

  if (apiEnvironment === 'custom') {
    presetApiUrls = getPresetApiUrls('production');
  } else {
    presetApiUrls = getPresetApiUrls(apiEnvironment);
  }

  if (apiEnvironment === 'custom') {
    return {
      apiEnvironment,
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
  }

  return {
    apiEnvironment,
    presetApiUrls,
    apiUrls: { ...presetApiUrls },
  };
};
