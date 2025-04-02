import { CourierClient } from '../index';

describe('BrandClient', () => {
  let courierClient: CourierClient;

  beforeEach(() => {
    courierClient = new CourierClient({
      userId: process.env.USER_ID!,
      jwt: process.env.JWT!
    });
  });

  it('should fetch brand settings successfully', async () => {
    const result = await courierClient.brands.getBrand(process.env.BRAND_ID!);
    expect(result.data.brand.settings?.inapp?.disableCourierFooter).toBe(null);
  });

});
