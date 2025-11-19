import { AxiosInstance } from "axios";

import { ITwitchChannelApiService } from "./interfaces/twitch-channel-api-service.interface";
import { FollowerBean } from "./models/follower-bean.model";
import { TwitchApiService } from "./twitch-api-service";

export default class TwitchChannelApiService
  implements ITwitchChannelApiService
{
  private streamsUrl = "https://api.twitch.tv/helix/streams";
  private followersUrl = "https://api.twitch.tv/helix/channels/followers";

  private axios: AxiosInstance;
  private twitchApiService: TwitchApiService;

  constructor(axios: AxiosInstance, twitchApiService: TwitchApiService) {
    this.axios = axios;
    this.twitchApiService = twitchApiService;
  }

  async isLive(requestData: { channel: string }): Promise<boolean> {
    const result = await this.axios.get(
      `${this.streamsUrl}?user_login=${requestData.channel}`
    );
    return result.data.data.length > 0;
  }

  async getAllFollowers(): Promise<Array<FollowerBean>> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    const followers: Array<FollowerBean> = [];

    if (broadcasterUser) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any | null = null;
      do {
        let currentCursor = null;
        if (result && result.data.pagination && result.data.pagination.cursor) {
          currentCursor = result.data.pagination.cursor;
        }

        result = await this.axios.get(
          `${this.followersUrl}?broadcaster_id=${broadcasterUser.id}${
            currentCursor !== null ? "&after=" + currentCursor : ""
          }`
        );

        followers.push(...result.data.data);
      } while (
        result &&
        result.data.pagination &&
        result.data.pagination.cursor
      );
    }

    return followers;
  }
}
