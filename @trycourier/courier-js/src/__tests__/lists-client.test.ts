import { CourierClient } from '../index';

describe('ListsClient', () => {
  let courierClient: CourierClient;

  beforeEach(() => {
    courierClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!,
      apiUrls: {
        courier: {
          rest: process.env.COURIER_REST_URL!,
          graphql: process.env.COURIER_GRAPHQL_URL!
        },
        inbox: {
          graphql: process.env.INBOX_GRAPHQL_URL!,
          webSocket: process.env.INBOX_WEBSOCKET_URL!
        }
      },
      showLogs: true
    });
  });

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
