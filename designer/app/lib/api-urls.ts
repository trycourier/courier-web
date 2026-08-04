import { type CourierApiUrls } from '@trycourier/courier-react';

type SearchParamsLike = {
  get(name: string): string | null;
};

export type ApiEnvironment = 'production' | 'production-eu' | 'staging' | 'dev' | 'custom';
type PublicApiEnvironment = 'production' | 'production-eu';

export const DEFAULT_API_ENVIRONMENT: ApiEnvironment = 'production';

const VALID_ENVIRONMENTS: ApiEnvironment[] = ['production', 'production-eu', 'staging', 'dev', 'custom'];

/**
 * Public, world-shippable environments — these URLs are already published in the
 * SDK and docs, so it's fine to keep them in this public repo.
 *
 * Internal environments (staging/dev/…) are intentionally NOT stored here. They
 * are served at runtime by `GET /inbox-demo/api/env-urls` from server env vars
 * (see {@link loadInternalEnvironments}) so internal hostnames never land in
 * this public repo.
 */
export const API_ENVIRONMENT_PRESETS: Record<PublicApiEnvironment, Readonly<CourierApiUrls>> = {
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
};

const PUBLIC_ENVIRONMENT_LABELS: Record<PublicApiEnvironment, string> = {
  production: 'Production',
  'production-eu': 'Production EU',
};

export interface ApiEnvironmentOption {
  id: ApiEnvironment;
  label: string;
}

const isPublicEnvironment = (env: string): env is PublicApiEnvironment =>
  env === 'production' || env === 'production-eu';

// --- Internal environments, fetched at runtime from the config endpoint -------

interface InternalEnvironment {
  id: string;
  label: string;
  apiUrls: CourierApiUrls;
}

let internalEnvironments: InternalEnvironment[] = [];
let internalEnvironmentsLoaded = false;
let internalEnvironmentsPromise: Promise<void> | null = null;

const findInternalEnvironment = (env: string): InternalEnvironment | undefined =>
  internalEnvironments.find((e) => e.id === env);

/** True once the internal environment list has been fetched (or has failed) at least once. */
export const areInternalEnvironmentsLoaded = (): boolean => internalEnvironmentsLoaded;

/**
 * Fetches the internal (non-public) API environments from the server config
 * endpoint and caches them. Public prod/prod-eu URLs are baked into this file;
 * everything else is served from server env so it never lands in this public
 * repo. Runs at most once — safe to call repeatedly.
 */
export const loadInternalEnvironments = (): Promise<void> => {
  if (internalEnvironmentsLoaded) return Promise.resolve();
  if (internalEnvironmentsPromise) return internalEnvironmentsPromise;

  internalEnvironmentsPromise = (async () => {
    try {
      const res = await fetch('/inbox-demo/api/env-urls');
      if (res.ok) {
        const data = (await res.json()) as { environments?: InternalEnvironment[] };
        if (Array.isArray(data.environments)) {
          internalEnvironments = data.environments;
        }
      }
    } catch {
      // Leave internalEnvironments empty on failure — only public envs remain available.
    } finally {
      internalEnvironmentsLoaded = true;
    }
  })();

  return internalEnvironmentsPromise;
};

export const resolveApiEnvironment = (value: string | null): ApiEnvironment =>
  value && VALID_ENVIRONMENTS.includes(value as ApiEnvironment)
    ? (value as ApiEnvironment)
    : DEFAULT_API_ENVIRONMENT;

/**
 * The environments offered by the switcher: the public presets, any internal
 * environments returned by the config endpoint, and Custom.
 */
export const getAvailableEnvironments = (): ApiEnvironmentOption[] => [
  { id: 'production', label: PUBLIC_ENVIRONMENT_LABELS.production },
  { id: 'production-eu', label: PUBLIC_ENVIRONMENT_LABELS['production-eu'] },
  ...internalEnvironments.map((e) => ({ id: e.id as ApiEnvironment, label: e.label })),
  { id: 'custom', label: 'Custom' },
];

/**
 * Resolves the API URLs for a non-custom environment. Public environments come
 * from {@link API_ENVIRONMENT_PRESETS}; internal ones come from the fetched
 * config, falling back to production until the config loads (or if the env is
 * not configured on the server).
 */
export const getPresetApiUrls = (env: Exclude<ApiEnvironment, 'custom'>): CourierApiUrls => {
  if (isPublicEnvironment(env)) {
    return {
      courier: { ...API_ENVIRONMENT_PRESETS[env].courier },
      inbox: { ...API_ENVIRONMENT_PRESETS[env].inbox },
    };
  }

  const internal = findInternalEnvironment(env);
  if (internal) {
    return {
      courier: { ...internal.apiUrls.courier },
      inbox: { ...internal.apiUrls.inbox },
    };
  }

  return {
    courier: { ...API_ENVIRONMENT_PRESETS.production.courier },
    inbox: { ...API_ENVIRONMENT_PRESETS.production.inbox },
  };
};

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
