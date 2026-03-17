import { getClient, hasClientTestEnv, hasTestEnv } from './utils';

const describeIntegration = hasClientTestEnv() && hasTestEnv('BRAND_ID') ? describe : describe.skip;

describeIntegration('BrandClient', () => {
  const courierClient = getClient();

  it('should fetch brand settings successfully', async () => {
    const brand = await courierClient.brands.getBrand({ brandId: process.env.BRAND_ID! });
    expect(brand.settings).toBeDefined();
  });

});
