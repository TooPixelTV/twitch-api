import { AxiosInstance } from "axios";

import { ITwitchModerationApiService } from "./interfaces/twitch-moderation-api-service.interface";
import { ModeratorsResultBean, TwitchSimpleUser } from "./models";

export default class TwitchModerationApiService
  implements ITwitchModerationApiService
{
  private serviceUrl = "https://api.twitch.tv/helix/moderation/moderators";

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

    let result: ModeratorsResultBean | null = null;
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
  }): Promise<ModeratorsResultBean | null> {
    const params: Array<string> = [];

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
}
