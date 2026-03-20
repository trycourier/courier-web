import {
  DEFAULT_COURIER_API_URLS,
  EU_COURIER_API_URLS,
  getCourierApiUrls,
  getCourierApiUrlsForRegion
} from '../index';

describe('Courier API URL presets', () => {
  it('keeps the default US endpoints unchanged', () => {
    expect(getCourierApiUrlsForRegion('us')).toEqual(DEFAULT_COURIER_API_URLS);
  });

  it('returns the full EU endpoint preset', () => {
    expect(getCourierApiUrlsForRegion('eu')).toEqual({
      courier: {
        rest: 'https://api.eu.courier.com',
        graphql: 'https://api.eu.courier.com/client/q',
      },
      inbox: {
        graphql: 'https://inbox.eu.courier.io/q',
        webSocket: 'wss://realtime.eu.courier.io'
      }
    });
  });

  it('returns cloned presets so callers can safely extend them', () => {
    const euApiUrls = getCourierApiUrlsForRegion('eu');
    euApiUrls.inbox.webSocket = 'wss://custom.example.com';

    expect(getCourierApiUrlsForRegion('eu')).toEqual(EU_COURIER_API_URLS);
    expect(getCourierApiUrlsForRegion('us')).toEqual(DEFAULT_COURIER_API_URLS);
  });

  it('continues to normalize caller overrides against the US defaults', () => {
    expect(getCourierApiUrls({
      courier: {
        ...getCourierApiUrlsForRegion('eu').courier,
        graphql: 'https://custom.example.com/client/q',
      },
      inbox: getCourierApiUrlsForRegion('eu').inbox,
    })).toEqual({
      courier: {
        rest: 'https://api.eu.courier.com',
        graphql: 'https://custom.example.com/client/q',
      },
      inbox: {
        graphql: 'https://inbox.eu.courier.io/q',
        webSocket: 'wss://realtime.eu.courier.io'
      }
    });
  });
});
