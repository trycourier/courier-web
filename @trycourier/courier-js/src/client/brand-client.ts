import { CourierBrandResponse } from '../types/brand';
import { getCourierApiUrls } from '../types/courier-api-urls';
import { CourierClientOptions } from './courier-client';

export class BrandClient {
  private options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  public async getBrand(brandId: string): Promise<CourierBrandResponse> {
    const query = `
      query GetBrand {
        brand(brandId: "${brandId}") {
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

    const urls = getCourierApiUrls(this.options);
    const response = await fetch(urls.courier.graphql, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.statusText}`);
    }

    return response.json() as Promise<CourierBrandResponse>;
  }
}
