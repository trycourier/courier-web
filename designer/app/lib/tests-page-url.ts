import {
  DEFAULT_TESTS_SHARED_FIELDS,
  TEST_ENV_LABELS,
  type TestApiEnvironment,
  type TestsSharedFieldValues,
} from '@/components/CourierTestsTab';

const VALID_ENVS = new Set<string>(Object.keys(TEST_ENV_LABELS));

export function parseTestsPageQuery(searchParams: URLSearchParams): {
  form: TestsSharedFieldValues;
  env: TestApiEnvironment;
} {
  const form: TestsSharedFieldValues = { ...DEFAULT_TESTS_SHARED_FIELDS };
  let env: TestApiEnvironment = 'production';

  const envParam = searchParams.get('env');
  if (envParam && VALID_ENVS.has(envParam)) {
    env = envParam as TestApiEnvironment;
  }

  const pick = (paramName: string) => searchParams.get(paramName);

  const apiKey = pick('apiKey');
  if (apiKey !== null) form.apiKey = apiKey;
  const userId = pick('userId');
  if (userId !== null) form.userId = userId;
  const brandId = pick('brandId');
  if (brandId !== null) form.brandId = brandId;
  const topicId = pick('topicId');
  if (topicId !== null) form.topicId = topicId;
  const clientKey = pick('clientKey');
  if (clientKey !== null) form.clientKey = clientKey;
  const expiresIn = pick('expiresIn');
  if (expiresIn !== null) form.expiresIn = expiresIn;
  const listId = pick('listId');
  if (listId !== null) form.listId = listId;

  const pl = searchParams.get('paginationLimit');
  if (pl !== null) {
    const n = Number(pl);
    if (Number.isFinite(n) && n >= 1) {
      form.paginationLimit = n;
    }
  }

  return { form, env };
}

export function buildTestsPageQuery(form: TestsSharedFieldValues, env: TestApiEnvironment): URLSearchParams {
  const p = new URLSearchParams();
  const def = DEFAULT_TESTS_SHARED_FIELDS;

  if (env !== 'production') {
    p.set('env', env);
  }
  if (form.apiKey.trim()) {
    p.set('apiKey', form.apiKey.trim());
  }
  if (form.userId.trim()) {
    p.set('userId', form.userId.trim());
  }
  if (form.brandId.trim()) {
    p.set('brandId', form.brandId.trim());
  }
  if (form.topicId.trim()) {
    p.set('topicId', form.topicId.trim());
  }
  if (form.clientKey.trim()) {
    p.set('clientKey', form.clientKey.trim());
  }
  if (form.expiresIn.trim() && form.expiresIn.trim() !== def.expiresIn) {
    p.set('expiresIn', form.expiresIn.trim());
  }
  if (form.listId.trim() && form.listId.trim() !== def.listId) {
    p.set('listId', form.listId.trim());
  }
  if (form.paginationLimit !== def.paginationLimit) {
    p.set('paginationLimit', String(form.paginationLimit));
  }

  return p;
}

export function canonicalTestsQueryString(params: URLSearchParams): string {
  return [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}
