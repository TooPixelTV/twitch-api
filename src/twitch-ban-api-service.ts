import { AxiosInstance } from "axios";

import { ITwitchBanApiService } from "./interfaces/twitch-ban-api-service.interface";
import { TwitchBanResult } from "./models";

export default class TwitchBanApiService implements ITwitchBanApiService {
  private banUrl = "https://api.twitch.tv/helix/moderation/bans";

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async banUser(requestData: {
    broadcaster_id: string;
    moderator_id: string;
    data: {
      user_id: string;
      duration?: number;
      reason?: string;
    };
  }): Promise<TwitchBanResult | null> {
    const response = await this.axios.post(
      `${this.banUrl}?broadcaster_id=${requestData.broadcaster_id}&moderator_id=${requestData.moderator_id}`,
      requestData.data
    );

    if (response) {
      return response.data.data[0];
    }

    return null;
  }

  public async unbanUser(requestData: {
    broadcaster_id: string;
    moderator_id: string;
    user_id: string;
  }): Promise<void> {
    await this.axios.delete(
      `${this.banUrl}?broadcaster_id=${requestData.broadcaster_id}&moderator_id=${requestData.moderator_id}&user_id=${requestData.user_id}`
    );
  }
}
