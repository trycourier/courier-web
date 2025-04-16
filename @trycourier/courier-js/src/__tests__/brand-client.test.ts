import { getClient } from './utils';

describe('BrandClient', () => {
  const courierClient = getClient();

  it('should fetch brand settings successfully', async () => {
    const brand = await courierClient.brands.getBrand({ brandId: 'YF16AVZZ574DF6MTY73E40F6CHH0' });
    expect(brand.settings?.inapp?.disableCourierFooter).toBeDefined();
  });

});
