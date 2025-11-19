import { AxiosInstance } from "axios";

import { ITwitchUserApiService } from "./interfaces/twitch-user-api-service.interface";
import { FollowedBroadcaster, TwitchUser } from "./models";

export default class TwitchUserApiService implements ITwitchUserApiService {
  private serviceUrl = "https://api.twitch.tv/helix/users";
  private followedUrl = "https://api.twitch.tv/helix/channels/followed";

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async getCurrentUserInfos(): Promise<TwitchUser | null> {
    const result = await this.axios.get(this.serviceUrl);

    return result.data.data[0];
  }

  public async getUserInfos(requestData: {
    userId: string;
  }): Promise<TwitchUser | null> {
    const result = await this.axios.get(
      this.serviceUrl + `?id=${requestData.userId}`
    );

    return result.data.data.length > 0 ? result.data.data[0] : null;
  }

  public async getMultipleUserInfos(requestData: {
    userIds: Array<string>;
  }): Promise<Array<TwitchUser>> {
    const result: Array<TwitchUser> = [];

    while (requestData.userIds.length > 0) {
      const usersList: Array<string> = requestData.userIds.splice(0, 100);
      const usersUrl = usersList.map((u) => `id=${u}`).join("&");

      const callResult = await this.axios.get(this.serviceUrl + `?${usersUrl}`);

      if (callResult.data && callResult.data.data) {
        result.push(...callResult.data.data);
      }
    }

    return result;
  }

  public async getAllFollowedChannels(): Promise<Array<FollowedBroadcaster>> {
    const user = await this.getCurrentUserInfos();

    const followedBroadcasters: Array<FollowedBroadcaster> = [];

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any | null = null;
      do {
        let currentCursor = null;
        if (result && result.data.pagination && result.data.pagination.cursor) {
          currentCursor = result.data.pagination.cursor;
        }

        result = await this.axios.get(
          `${this.followedUrl}?user_id=${user.id}${
            currentCursor !== null ? "&after=" + currentCursor : ""
          }`
        );

        followedBroadcasters.push(...result.data.data);
      } while (
        result &&
        result.data.pagination &&
        result.data.pagination.cursor
      );
    }

    return followedBroadcasters;
  }
}
