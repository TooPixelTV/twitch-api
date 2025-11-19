import { FollowedBroadcaster, TwitchUser } from "../models";

export interface ITwitchUserApiService {
  getCurrentUserInfos(): Promise<TwitchUser | null>;
  getUserInfos(requestData: { userId: string }): Promise<TwitchUser | null>;
  getMultipleUserInfos(requestData: {
    userIds: Array<string>;
  }): Promise<Array<TwitchUser>>;
  getAllFollowedChannels(): Promise<Array<FollowedBroadcaster>>;
}
