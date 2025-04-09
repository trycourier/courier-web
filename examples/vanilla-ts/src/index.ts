import { CourierClient } from '@trycourier/courier-js';

async function main() {

  const client = new CourierClient({
    userId: 'mike',
    showLogs: true,
  });

  const preferences = await client.preferences.getUserPreferences();
  console.log(preferences);
}

main().catch(console.error);
