import { AxiosInstance } from "axios";

import { ITwitchSubscribersApiService } from "./interfaces";
import { TwitchUserSubcription } from "./models/twitch-user-subscription.model";

export default class TwitchSubscribersApiService
  implements ITwitchSubscribersApiService
{
  private serviceUrl = "https://api.twitch.tv/helix/subscriptions";

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async getSubscribers(filter: {
    broadcaster_id: string;
    user_ids?: Array<string>;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchUserSubcription> | null> {
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
        console.error("Error at : getAllSubscribers");
        console.error(e);
      });

    if (result && result.data) {
      return result.data;
    }

    return null;
  }
}
