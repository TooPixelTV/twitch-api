import {
  BannedUsersResultBean,
  TwitchSimpleUser,
  UsersResultBean,
} from "../models";

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
  getBannedUsers(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<BannedUsersResultBean | null>;
}
