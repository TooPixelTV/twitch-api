import { TwitchBanResult } from "../models";

export interface ITwitchBanApiService {
  banUser(requestData: {
    broadcaster_id: string;
    moderator_id: string;
    data: {
      user_id: string;
      duration?: number;
      reason?: string;
    };
  }): Promise<TwitchBanResult | null>;
  unbanUser(requestData: {
    broadcaster_id: string;
    moderator_id: string;
    user_id: string;
  }): Promise<void>;
}
