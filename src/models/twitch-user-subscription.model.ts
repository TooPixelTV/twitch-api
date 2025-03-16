export interface TwitchUserSubcription {
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  is_gift: boolean;
  gifter_id?: string;
  gifter_login?: string;
  gifter_name?: string;
  tier: string;
  plan_name: string;
  user_id: string;
  user_name: string;
  user_login: string;
}
