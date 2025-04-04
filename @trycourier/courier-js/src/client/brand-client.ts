import { CourierBrand, CourierBrandsResponse } from '../types/brands';
import { http } from '../utils/request';
import { Client } from './client';

export class BrandClient extends Client {

  public async getBrand(props: { brandId: string }): Promise<CourierBrand> {
    const json = await http({
      url: `${this.urls.courier.rest}/brands/${props.brandId}`,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      method: 'GET',
      options: this.options,
    });

    return json as CourierBrand;
  }


  public async getBrands(props?: { cursor?: string }): Promise<CourierBrandsResponse> {

    let url = `${this.urls.courier.rest}/brands`;
    if (props?.cursor) {
      url += `?cursor=${props.cursor}`;
    }

    const json = await http({
      url,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      method: 'GET',
      options: this.options,
    });

    return json as CourierBrandsResponse;
  }

}
