import { AxiosInstance } from "axios";

import { ITwitchChannelApiService } from "./interfaces/twitch-channel-api-service.interface";
import { FollowerBean } from "./models/follower-bean.model";
import { TwitchApiService } from "./twitch-api-service";
import { UsersResultBean, TwitchSimpleUser } from "./models";

export default class TwitchChannelApiService
  implements ITwitchChannelApiService
{
  private streamsUrl = "https://api.twitch.tv/helix/streams";
  private followersUrl = "https://api.twitch.tv/helix/channels/followers";
  private vipsUrl = "https://api.twitch.tv/helix/channels/vips";

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
  
  public async getAllVips(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchSimpleUser>> {
    const vips: Array<TwitchSimpleUser> = [];

    let result: UsersResultBean | null = null;
    do {
      if (result && result.pagination && result.pagination.cursor) {
        requestData.after = result.pagination.cursor;
      }

      result = await this.getVips(requestData);

      if (result && result.data) {
        vips.push(...result.data);
      }
    } while (result && result.pagination && result.pagination.cursor);

    return vips;
  }

  public async getVips(filter: {
    broadcaster_id: string;
    user_ids?: Array<string>;
    first?: string;
    after?: string;
  }): Promise<UsersResultBean | null> {
    const params: Array<string> = [];

    params.push(`broadcaster_id=${filter.broadcaster_id}`);

    if (filter.first) {
      params.push(`first=${filter.first}`);
    }

    if (filter.user_ids) {
      filter.user_ids.forEach((user_id) => {
        params.push(`user_id=${user_id}`);
      });
    }

    if (filter.after) {
      params.push(`after=${filter.after}`);
    }

    let paramsUrl = "";
    if (params.length > 0) {
      paramsUrl += `?${params.join("&")}`;
    }
    const result = await this.axios
      .get(`${this.vipsUrl}${paramsUrl}`)
      .catch((e) => {
        console.error("Error at : getVips");
        console.error(e);
      });

    if (result && result.data) {
      return result.data;
    }

    return null;
  }
}
