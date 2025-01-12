import { TwitchEventsubTransport, TwitchSubscription } from '../models';
import { SubscriptionsResultBean } from '../models/subscriptions-result-bean.model';

export interface ITwitchEventsubApiService {
  createSubscription(requestData: {
    type: string;
    version: string;
    condition: unknown;
    transport: TwitchEventsubTransport;
  }): Promise<{
    data: Array<TwitchSubscription>;
    total: number;
    total_cost: number;
    max_total_cost: number;
  } | null>;
  deleteSubscription(requestData: { subscriptionId: string }): Promise<boolean>;
  getAllSubscriptions(requestData: {
    status?: string;
    type?: string;
    user_id?: string;
    after?: string;
  }): Promise<Array<TwitchSubscription>>;
  getSubscriptions(requestData: {
    status?: string;
    type?: string;
    user_id?: string;
    after?: string;
  }): Promise<SubscriptionsResultBean | null>;
}
