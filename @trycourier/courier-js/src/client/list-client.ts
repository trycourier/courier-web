import { http } from '../utils/request';
import { Client } from './client';

export class ListClient extends Client {

  public async putSubscription(props: {
    listId: string;
  }): Promise<void> {
    return await http({
      url: `${this.options.urls.courier.rest}/lists/${props.listId}/subscriptions/${this.options.userId}`,
      options: this.options,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
      },
    });
  }

  public async deleteSubscription(props: {
    listId: string;
  }): Promise<void> {
    return await http({
      url: `${this.options.urls.courier.rest}/lists/${props.listId}/subscriptions/${this.options.userId}`,
      options: this.options,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
      },
    });
  }

}
