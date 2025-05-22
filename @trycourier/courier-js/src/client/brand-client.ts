import { CourierBrand } from '../types/brands';
import { graphql } from '../utils/request';
import { Client } from './client';

export class BrandClient extends Client {

  /**
   * Get a brand by ID using GraphQL
   * @param brandId - The ID of the brand to retrieve
   * @returns Promise resolving to the requested brand
   */
  public async getBrand(props: { brandId: string }): Promise<CourierBrand> {
    const query = `
      query GetBrand {
        brand(brandId: "${props.brandId}") {
          settings {
            colors {
              primary
              secondary
              tertiary
            }
            inapp {
              borderRadius
              disableCourierFooter
            }
          }
        }
      }
    `;

    const json = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
      query,
      variables: { brandId: props.brandId }
    });

    return json.data.brand as CourierBrand;
  }

}
