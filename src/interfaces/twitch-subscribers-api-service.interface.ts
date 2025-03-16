import { TwitchUserSubcription } from "../models/twitch-user-subscription.model";

export interface ITwitchSubscribersApiService {
  getSubscribers(filter: {
    broadcaster_id: string;
    user_ids?: Array<string>;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchUserSubcription> | null>;
}
