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
  }): Promise<Array<TwitchUserSubcription> | null> {
    const subscribers: Array<TwitchUserSubcription> = [];

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any | null = null;
      do {
        let currentCursor = null;
        if (result && result.data.pagination && result.data.pagination.cursor) {
          currentCursor = result.data.pagination.cursor;
        }

        const params: Array<string> = [];

        params.push(`broadcaster_id=${filter.broadcaster_id}`);

        if (filter.user_ids) {
          filter.user_ids.forEach((user_id) => {
            params.push(`user_id=${user_id}`);
          });
        }

        if (currentCursor) {
          params.push(`after=${currentCursor}`);
        }

        let paramsUrl = "";
        if (params.length > 0) {
          paramsUrl += `?${params.join("&")}`;
        }

        result = await this.axios.get(`${this.serviceUrl}${paramsUrl}`);

        subscribers.push(...result.data.data);
      } while (
        result &&
        result.data.pagination &&
        result.data.pagination.cursor
      );
    } catch (e) {
      console.log("Error at : getAllSubscribers");
      console.log(e);
    }

    return subscribers;
  }
}
