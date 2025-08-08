const CDN_BASE_URL = 'https://unpkg.com';

export const getCDNUrl = (dependency: string, version: string) => {
  return `${CDN_BASE_URL}/${dependency}@${version}/dist/index.cdn.js`;
};
