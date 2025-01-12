import { AxiosInstance } from 'axios';

import { ITwitchEventsubApiService } from './interfaces/twitch-eventsub-service.interface';
import { TwitchEventsubTransport, TwitchSubscription } from './models';
import { SubscriptionsResultBean } from './models/subscriptions-result-bean.model';

export default class TwitchEventsubApiService
  implements ITwitchEventsubApiService
{
  private serviceUrl = 'https://api.twitch.tv/helix/eventsub/subscriptions';

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async createSubscription(requestData: {
    type: string;
    version: string;
    condition: unknown;
    transport: TwitchEventsubTransport;
  }): Promise<{
    data: Array<TwitchSubscription>;
    total: number;
    total_cost: number;
    max_total_cost: number;
  } | null> {
    const result = await this.axios
      .post(this.serviceUrl, {
        type: requestData.type,
        version: requestData.version,
        condition: requestData.condition,
        transport: requestData.transport,
      })
      .catch((e) => {
        console.error('Error at : createSubscription');
        console.error(e);
      });

    if (
      result &&
      result.data &&
      result.data.data &&
      result.data.data.length > 0
    ) {
      return result.data;
    }

    return null;
  }

  public async deleteSubscription(requestData: {
    subscriptionId: string;
  }): Promise<boolean> {
    await this.axios.delete(
      `${this.serviceUrl}?id=${requestData.subscriptionId}`
    );
    return true;
  }

  public async getAllSubscriptions(filter: {
    status?: string;
    type?: string;
    user_id?: string;
    after?: string;
  }): Promise<Array<TwitchSubscription>> {
    const subs: Array<TwitchSubscription> = [];

    let result: SubscriptionsResultBean | null = null;
    do {
      if (result && result.pagination && result.pagination.cursor) {
        filter.after = result.pagination.cursor;
      }

      result = await this.getSubscriptions(filter);

      if (result && result.data) {
        subs.push(...result.data);
      }
    } while (result && result.pagination && result.pagination.cursor);

    return subs;
  }

  public async getSubscriptions(filter: {
    status?: string;
    type?: string;
    user_id?: string;
    after?: string;
  }): Promise<SubscriptionsResultBean | null> {
    const params: Array<string> = [];

    if (filter.status) {
      params.push(`status=${filter.status}`);
    } else if (filter.type) {
      params.push(`type=${filter.type}`);
    } else if (filter.user_id) {
      params.push(`user_id=${filter.user_id}`);
    }

    if (filter.after) {
      params.push(`after=${filter.after}`);
    }

    let paramsUrl = '';
    if (params.length > 0) {
      paramsUrl += `?${params.join('&')}`;
    }
    const result = await this.axios
      .get(`${this.serviceUrl}${paramsUrl}`)
      .catch((e) => {
        console.error('Error at : getSubscriptions');
        console.error(e);
      });

    if (result && result.data) {
      return result.data;
    }

    return null;
  }
}
