import { CourierClient } from '../client/courier-client';
import { getClient } from './utils';

describe('BrandClient', () => {
  const courierClient = getClient();

  it('should fetch brand settings successfully', async () => {

    const client = new CourierClient({
      userId: '1234567890',
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InVzZXJfaWQ6bWlrZSB3cml0ZTp1c2VyLXRva2VucyBpbmJveDpyZWFkOm1lc3NhZ2VzIGluYm94OndyaXRlOmV2ZW50cyByZWFkOnByZWZlcmVuY2VzIHdyaXRlOnByZWZlcmVuY2VzIHJlYWQ6bGlzdHMgd3JpdGU6bGlzdHMgd3JpdGU6dHJhY2siLCJ0ZW5hbnRfc2NvcGUiOiJwdWJsaXNoZWQvcHJvZHVjdGlvbiIsInRlbmFudF9pZCI6ImQ5NDllNmMwLTg1ZjgtNDI4NC05NWNjLWNiZjM2YzRjMjlhYiIsImlhdCI6MTc0NDg0MDc2NiwiZXhwIjoxODMxMjQwNzY2LCJqdGkiOiJjZjY4ZTFjZi03ZGNiLTQ0MDMtYTA1Mi1mNzBmNGYzNTU2Y2UifQ.dmxOb-wrsvle0q0epT3mX3qFcjRMzjDJZ2V6meKLF0k'
    });

    const brand = await client.brands.getBrand({ brandId: 'YF16AVZZ574DF6MTY73E40F6CHH0' });
    expect(brand.settings?.inapp?.disableCourierFooter).toBeDefined();
  });

});
