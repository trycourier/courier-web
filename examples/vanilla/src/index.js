const { Courier } = require('@trycourier/courier-js');

async function main() {
  // Initialize Courier with authentication listener
  Courier.shared.addAuthenticationListener((props) => {
    console.log('Authentication state changed:', props);
  });

  // Sign in user
  Courier.shared.signIn({
    userId: 'user123',
    showLogs: true
  });

  try {
    // Get user preferences
    const preferences = await Courier.shared.preferences.getUserPreferences();
    console.log('User preferences:', preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
  }
}

main().catch(console.error);
