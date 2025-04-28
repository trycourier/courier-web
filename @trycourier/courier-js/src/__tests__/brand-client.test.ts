import { getClient } from './utils';

describe('BrandClient', () => {
  const courierClient = getClient();

  it('should fetch brand settings successfully', async () => {
    const brand = await courierClient.brands.getBrand({ brandId: process.env.BRAND_ID! });
    expect(brand.settings).toBeDefined();
  });

});
