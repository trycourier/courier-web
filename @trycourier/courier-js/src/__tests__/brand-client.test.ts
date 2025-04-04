import { CourierClient } from '../index';

describe('BrandClient', () => {
  let courierClient: CourierClient;

  beforeEach(() => {
    courierClient = new CourierClient({
      userId: process.env.USER_ID!,
      publicApiKey: process.env.PUBLIC_API_KEY!,
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

  it('should fetch brand settings successfully', async () => {
    const brand = await courierClient.brands.getBrand({ brandId: process.env.BRAND_ID! });
    expect(brand.settings?.inapp?.disableCourierFooter).toBe(null);
  });

  it('should fetch brands successfully', async () => {
    const brands = await courierClient.brands.getBrands();
    expect(brands.results.length).toBeGreaterThan(0);
  });

});
