import { AxiosInstance } from "axios";

import { ITwitchModerationApiService } from "./interfaces/twitch-moderation-api-service.interface";
import {
  BannedUsersResultBean,
  TwitchBannedUserBean,
  TwitchSimpleUser,
  UsersResultBean,
} from "./models";

export default class TwitchModerationApiService implements ITwitchModerationApiService {
  private serviceUrl = "https://api.twitch.tv/helix/moderation/moderators";
  private bannedUsersServiceUrl =
    "https://api.twitch.tv/helix/moderation/banned";

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async getAllModerators(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchSimpleUser>> {
    const moderators: Array<TwitchSimpleUser> = [];

    let result: UsersResultBean | null = null;
    do {
      if (result && result.pagination && result.pagination.cursor) {
        requestData.after = result.pagination.cursor;
      }

      result = await this.getModerators(requestData);

      if (result && result.data) {
        moderators.push(...result.data);
      }
    } while (result && result.pagination && result.pagination.cursor);

    return moderators;
  }

  public async getModerators(filter: {
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
      .get(`${this.serviceUrl}${paramsUrl}`)
      .catch((e) => {
        console.error("Error at : getModerators");
        console.error(e);
      });

    if (result && result.data) {
      return result.data;
    }

    return null;
  }

  public async getAllBannedUsers(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchBannedUserBean>> {
    const bannedUsers: Array<TwitchBannedUserBean> = [];

    let result: BannedUsersResultBean | null = null;
    do {
      if (result && result.pagination && result.pagination.cursor) {
        requestData.after = result.pagination.cursor;
      }

      result = await this.getBannedUsers(requestData);

      if (result && result.data) {
        bannedUsers.push(...result.data);
      }
    } while (result && result.pagination && result.pagination.cursor);

    return bannedUsers;
  }

  public async getBannedUsers(filter: {
    broadcaster_id: string;
    user_ids?: Array<string>;
    first?: string;
    after?: string;
  }): Promise<BannedUsersResultBean | null> {
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
      .get(`${this.bannedUsersServiceUrl}${paramsUrl}`)
      .catch((e) => {
        console.error("Error at : getBannedUsers");
        console.error(e);
      });

    if (result && result.data) {
      return result.data;
    }

    return null;
  }
}
