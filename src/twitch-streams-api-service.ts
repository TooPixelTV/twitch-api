import { AxiosInstance } from "axios";

import { ITwitchStreamsApiService } from "./interfaces/twitch-streams-api-service.interface";

export default class TwitchStreamsApiService
  implements ITwitchStreamsApiService
{
  private static readonly MAX_IDS_PER_REQUEST = 100;

  private serviceUrl = "https://api.twitch.tv/helix/streams";

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async getLiveUserIds(userIds: Array<string>): Promise<Array<string>> {
    const liveUserIds: Array<string> = [];
    const uniqueIds = [...new Set(userIds)];

    for (
      let i = 0;
      i < uniqueIds.length;
      i += TwitchStreamsApiService.MAX_IDS_PER_REQUEST
    ) {
      const batch = uniqueIds.slice(
        i,
        i + TwitchStreamsApiService.MAX_IDS_PER_REQUEST
      );
      const query = batch
        .map((id) => "user_id=" + encodeURIComponent(id))
        .join("&");

      // first=100 : au plus 100 ids demandés, donc une seule page de résultats
      const result = await this.axios.get(
        `${this.serviceUrl}?type=live&first=${TwitchStreamsApiService.MAX_IDS_PER_REQUEST}&${query}`
      );

      for (const stream of result.data.data) {
        liveUserIds.push(stream.user_id);
      }
    }

    return liveUserIds;
  }
}
