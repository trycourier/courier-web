import { http } from '../utils/request';
import { Client } from './client';

export class ListClient extends Client {

  /**
   * @deprecated The clientKey parameter is deprecated and will be removed in a future release.
   *
   * Subscribe a user to a list
   * @param listId - The ID of the list to subscribe to
   * @param clientKey - The client key for your Courier project
   * @returns Promise resolving when subscription is complete
   * @see https://www.courier.com/docs/api-reference/lists/subscribe-user-profile-to-list
   */
  public async putSubscription(props: { listId: string; clientKey: string; }): Promise<void> {
    this.options.logger.warn('Courier Warning: The clientKey parameter in putSubscription is deprecated and will be removed in a future release.');
    return await http({
      url: `${this.options.apiUrls.courier.rest}/client/lists/${props.listId}/subscribe/${this.options.userId}`,
      options: this.options,
      method: 'PUT',
      headers: {
        'x-courier-client-key': props.clientKey,
        Authorization: `Bearer ${this.options.accessToken}`,
      },
    });
  }

  /**
   * @deprecated The clientKey parameter is deprecated and will be removed in a future release.
   *
   * Unsubscribe a user from a list
   * @param listId - The ID of the list to unsubscribe from
   * @param clientKey - The client key for your Courier project
   * @returns Promise resolving when unsubscription is complete
   * @see https://www.courier.com/docs/api-reference/lists/unsubscribe-user-profile-from-list
   */
  public async deleteSubscription(props: { listId: string; clientKey: string; }): Promise<void> {
    this.options.logger.warn('Courier Warning: The clientKey parameter in deleteSubscription is deprecated and will be removed in a future release.');
    return await http({
      url: `${this.options.apiUrls.courier.rest}/client/lists/${props.listId}/unsubscribe/${this.options.userId}`,
      options: this.options,
      method: 'DELETE',
      headers: {
        'x-courier-client-key': props.clientKey,
        Authorization: `Bearer ${this.options.accessToken}`,
      },
    });
  }

}
