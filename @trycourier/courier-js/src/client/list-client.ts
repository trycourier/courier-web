import { http } from '../utils/request';
import { Client } from './client';

export class ListClient extends Client {

  /**
   * Subscribe a user to a list
   * @param listId - The ID of the list to subscribe to
   * @returns Promise resolving when subscription is complete
   * @see https://www.courier.com/docs/reference/lists/recipient-subscribe
   */
  public async putSubscription(props: {
    listId: string;
  }): Promise<void> {
    return await http({
      url: `${this.options.apiUrls.courier.rest}/lists/${props.listId}/subscriptions/${this.options.userId}`,
      options: this.options,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
      },
    });
  }

  /**
   * Unsubscribe a user from a list
   * @param listId - The ID of the list to unsubscribe from
   * @returns Promise resolving when unsubscription is complete
   * @see https://www.courier.com/docs/reference/lists/delete-subscription
   */
  public async deleteSubscription(props: {
    listId: string;
  }): Promise<void> {
    return await http({
      url: `${this.options.apiUrls.courier.rest}/lists/${props.listId}/subscriptions/${this.options.userId}`,
      options: this.options,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
      },
    });
  }

}
