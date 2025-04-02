import { CourierClient } from '../index';

describe('TokenClient', () => {
  let courierClient: CourierClient;

  beforeEach(() => {
    courierClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!,
      showLogs: true
    });
  });

  it('should store token successfully', async () => {
    const result = await courierClient.tokens.putUserToken({
      token: 'test-token',
      provider: 'test-provider',
      device: {
        appId: 'test-app-id',
        adId: 'test-ad-id',
        deviceId: 'test-device-id',
        platform: 'test-platform',
        manufacturer: 'test-manufacturer',
        model: 'test-model',
      },
    });
    expect(result).toBeUndefined();
  });

  it('should delete token successfully', async () => {
    const result = await courierClient.tokens.deleteUserToken({
      token: 'test-token',
    });
    expect(result).toBeUndefined();
  });
});
