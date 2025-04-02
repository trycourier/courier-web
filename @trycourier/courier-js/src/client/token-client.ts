import { CourierDevice } from '../types/token';
import { http } from '../utils/request';
import { Client } from './client';

export class TokenClient extends Client {

  /**
   * Store a push notification token for a user
   * @see https://www.courier.com/docs/reference/token-management/put-token
   */
  public async putUserToken(props: {
    token: string;
    provider: string;
    device?: CourierDevice;
  }): Promise<void> {
    const payload = {
      provider_key: props.provider,
      ...(props.device && {
        device: {
          app_id: props.device.appId,
          ad_id: props.device.adId,
          device_id: props.device.deviceId,
          platform: props.device.platform,
          manufacturer: props.device.manufacturer,
          model: props.device.model
        }
      })
    };

    const headers: Record<string, string> = {};
    if (this.options.jwt) {
      headers['Authorization'] = `Bearer ${this.options.jwt}`;
    }

    await http({
      url: `${this.urls.courier.rest}/users/${this.options.userId}/tokens/${props.token}`,
      method: 'PUT',
      headers,
      body: payload,
      options: this.options,
      validCodes: [200, 204]
    });
  }

  /**
   * Delete a push notification token for a user
   */
  public async deleteUserToken(props: {
    token: string;
  }): Promise<void> {
    const headers: Record<string, string> = {};
    if (this.options.jwt) {
      headers['Authorization'] = `Bearer ${this.options.jwt}`;
    }

    await http({
      url: `${this.urls.courier.rest}/users/${this.options.userId}/tokens/${props.token}`,
      method: 'DELETE',
      headers,
      options: this.options,
      validCodes: [200, 204]
    });
  }
}
