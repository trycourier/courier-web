import { CourierClient } from '@trycourier/courier-js';

async function main() {
  const client = new CourierClient({
    baseURL: 'https://api.example.com',
    timeout: 5000
  });

  try {
    // Example API call using the client
    const response = await client.fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'GET'
    });
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
