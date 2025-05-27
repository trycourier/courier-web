import { getClient } from './utils';

describe('ListsClient', () => {
  const courierClient = getClient();

  // TODO(C-13925): Support subscriptions.
  it.skip('should put subscription successfully', async () => {
    await courierClient.lists.putSubscription({
      listId: 'example-list-id'
    });
  });

  // TODO(C-13925): Support subscriptions.
  it.skip('should delete subscription successfully', async () => {
    await courierClient.lists.deleteSubscription({
      listId: 'example-list-id'
    });
  });
});
