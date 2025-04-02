import { CourierClient } from '@trycourier/courier-js';

async function main() {
  const client = new CourierClient({
    userId: 'mike',
    jwt: '',
    showLogs: true
  });

  try {
    // Example API call using the client
    const response = await client.tokens.putUserToken({
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
    console.log(response);
    const response2 = await client.tokens.deleteUserToken({
      token: 'test-token',
    });
    console.log(response2);
  } catch (error) {
    console.error(error);
  }
}

main().catch(console.error);
