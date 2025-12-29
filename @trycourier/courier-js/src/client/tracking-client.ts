import { CourierTrackingEvent } from '../types/tracking-event';
import { http } from '../utils/request';
import { Client } from './client';

export class TrackingClient extends Client {

  /**
   * @deprecated This method is deprecated and will be removed or changed significantly in a future release.
   *
   * Post an inbound courier event. This is typically used for tracking custom events
   * related to a specific message in Courier.
   * 
   * @param props.clientKey - The client key associated with your Courier project. 
   *   You can get your client key here: https://app.courier.com/settings/api-keys
   * @param props.event - The name of the event (e.g., "New Order Placed").
   * @param props.messageId - The unique ID of the message this event relates to.
   * @param props.type - The type of event. Only supported value: "track".
   * @param props.properties - (Optional) Additional custom properties for the event.
   * @returns Promise resolving to an object containing the messageId.
   * @see https://www.courier.com/docs/api-reference/inbound/courier-track-event
   */
  public async postInboundCourier(props: {
    clientKey: string;
    event: string;
    messageId: string;
    type: 'track';
    properties?: Record<string, any>;
  }): Promise<{ messageId: string }> {
    const { clientKey, ...bodyProps } = props;
    return await http({
      url: `${this.options.apiUrls.courier.rest}/inbound/courier`,
      options: this.options,
      method: 'POST',
      headers: {
        'x-courier-client-key': clientKey,
      },
      body: {
        ...bodyProps,
        userId: this.options.userId
      },
      validCodes: [200, 202]
    });
  }

  /**
   * Post a tracking URL event
   * These urls are found in messages sent from Courier
   * @param url - The URL to post the event to
   * @param event - The event type: Available options: "click", "open", "unsubscribe"
   * @returns Promise resolving when the event is posted
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
