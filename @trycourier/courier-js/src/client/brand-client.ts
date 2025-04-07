import { CourierBrand, CourierBrandsResponse } from '../types/brands';
import { http } from '../utils/request';
import { Client } from './client';

export class BrandClient extends Client {

  /**
   * Get a brand by ID
   * @see https://www.courier.com/docs/reference/brands/get-a-brand
   */
  public async getBrand(props: { brandId: string }): Promise<CourierBrand> {
    const json = await http({
      options: this.options,
      url: `${this.options.urls.courier.rest}/brands/${props.brandId}`,
      headers: {
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      method: 'GET',
    });

    return json as CourierBrand;
  }

  /**
   * Get all brands
   * @see https://www.courier.com/docs/reference/brands/list-brands
   */
  public async getBrands(props?: { cursor?: string }): Promise<CourierBrandsResponse> {
    let url = `${this.options.urls.courier.rest}/brands`;
    if (props?.cursor) {
      url += `?cursor=${props.cursor}`;
    }

    const json = await http({
      options: this.options,
      url,
      headers: {
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      method: 'GET',
    });

    return json as CourierBrandsResponse;
  }

}
