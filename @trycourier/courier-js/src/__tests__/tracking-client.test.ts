import { CourierClient } from '../index';

describe('TrackingClient', () => {
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

  it('should post tracking url successfully', async () => {
    await courierClient.tracking.postTrackingUrl({
      url: 'https://d949e6c0-85f8-4284-95cc-cbf36c4c29ab.ct0.app/t/zYLfXkZVSINu0pJBSrf0EjDdSGXJQ1Bx0kRg0ZJgbK-SMa4BF7x-I9-3MsSDH5NddcUhvMMbGOz5R4rrEyKESsSKO0m4MnosFZMEjWkG-Xjy5LSmO3mad4vO5Szeg04KILk5sZHEzNO5UwikXwSmvUH7VhlhrpZWJlHvJ2i-zquPlcfsVt5C3XBP1_08ep_90gqQ40CbjW0r5JQrVHm43BV2l-WIg8CJ6eNYp4nGTtc_h1_idE-WMenw2TPpuTELIoTD5EtP8X2eKszcQ5nBQvnUxL15MnrZVSkq8-BYewOufSbewTt2bGTUbnFRDtqrrh9mUmgYHmxPnyfL9PKnPA',
      event: 'CLICKED'
    });
  });


});
