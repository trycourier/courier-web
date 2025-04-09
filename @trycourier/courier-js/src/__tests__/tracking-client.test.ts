import { CourierClient } from '../index';

describe('ListsClient', () => {
  let courierClient: CourierClient;

  beforeEach(() => {
    courierClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!,
      showLogs: true,
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
    });
  });

  it('should post inbound courier successfully', async () => {
    const result = await courierClient.tracking.postInboundCourier({
      event: 'test_event',
      messageId: crypto.randomUUID(),
      type: 'track',
      properties: {
        foo: 'bar'
      }
    });

    expect(result).toBeDefined();
    expect(result.messageId).toBeDefined();
  });


});
