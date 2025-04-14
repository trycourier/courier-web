import { Courier } from '@trycourier/courier-js';

async function main() {

  const listener = Courier.shared.addAuthenticationListener((props) => {
    console.log('Authentication state changed:', props);
  });

  Courier.shared.signIn({
    userId: 'mike',
    showLogs: true,
  });

  setTimeout(() => {
    Courier.shared.signOut();
    listener.remove();
  }, 1000);

  // const client = new CourierClient({
  //   userId: 'mike',
  //   showLogs: true,
  // });

  // const preferences = await client.preferences.getUserPreferences();
  // console.log(preferences);


}

main().catch(console.error);
