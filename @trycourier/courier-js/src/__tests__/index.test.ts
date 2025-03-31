import { CourierClient } from '../index';

describe('CourierClient', () => {
  let api: CourierClient;

  beforeEach(() => {
    api = new CourierClient({
      baseURL: 'https://api.example.com',
    });
  });

  it('Test get request', async () => {
    const result = await api.fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'GET'
    });
    const json = await result.json();
    expect(json).toEqual({
      userId: 1,
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
    });
  });
});