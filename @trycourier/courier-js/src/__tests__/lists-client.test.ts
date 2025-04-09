import { getClient } from './utils';

describe('ListsClient', () => {
  const courierClient = getClient();

  it('should put subscription successfully', async () => {
    await courierClient.lists.putSubscription({
      listId: 'example-list-id'
    });
  });

  it('should delete subscription successfully', async () => {
    await courierClient.lists.deleteSubscription({
      listId: 'example-list-id'
    });
  });
});
