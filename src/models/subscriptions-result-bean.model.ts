import { TwitchSubscription } from './twitch-subscription.model';

export interface SubscriptionsResultBean {
  data: Array<TwitchSubscription>;
  total: number;
  total_cost: number;
  max_total_cost: number;
  pagination?: {
    cursor?: string;
  };
}
