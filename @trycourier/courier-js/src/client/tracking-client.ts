import { CourierTrackingEvent } from '../types/tracking-event';
import { http } from '../utils/request';
import { Client } from './client';

export class TrackingClient extends Client {

  /**
   * Post an inbound courier event
   * @see https://www.courier.com/docs/reference/inbound/courier-track-event
   */
  public async postInboundCourier(props: {
    event: string;
    messageId: string;
    type: 'track';
    properties?: Record<string, any>;
  }): Promise<{ messageId: string }> {
    return await http({
      url: `${this.options.urls.courier.rest}/inbound/courier`,
      options: this.options,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
      },
      body: {
        ...props,
        userId: this.options.userId
      },
      validCodes: [200, 202]
    });
  }

  /**
   * Post a tracking URL event
   * These urls are found in messages sent from Courier
   */
  public async postTrackingUrl(props: {
    url: string;
    event: CourierTrackingEvent;
  }): Promise<void> {
    return await http({
      url: props.url,
      options: this.options,
      method: 'POST',
      body: {
        event: props.event
      }
    });
  }

}
