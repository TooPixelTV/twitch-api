import { UsersResultBean, TwitchSimpleUser } from "../models";

export interface ITwitchModerationApiService {
  getAllModerators(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchSimpleUser>>;
  getModerators(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<UsersResultBean | null>;
}
