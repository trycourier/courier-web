import { CourierBrandResponse } from '../types/brands';
import { graphql } from '../utils/request';
import { Client } from './client';

export class BrandClient extends Client {

  public async getBrand(props: {
    brandId: string;
  }): Promise<CourierBrandResponse> {
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-courier-user-id': this.options.userId,
    };

    if (this.options.jwt) {
      headers['Authorization'] = `Bearer ${this.options.jwt}`;
    } else if (this.options.clientKey) {
      headers['x-courier-client-key'] = this.options.clientKey;
    }

    const json = await graphql({
      url: this.urls.courier.graphql,
      headers,
      query,
      options: this.options,
    });

    return json as CourierBrandResponse;
  }
}
