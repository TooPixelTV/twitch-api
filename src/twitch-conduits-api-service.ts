import { AxiosInstance } from 'axios';

import { ITwitchConduitsApiService } from './interfaces/twitch-conduits-api-service.interface';
import { TwitchConduit, TwitchConduitShard } from './models';

export default class TwitchConduitsApiService
  implements ITwitchConduitsApiService
{
  private serviceUrl = 'https://api.twitch.tv/helix/eventsub/conduits';
  private shardServiceUrl = this.serviceUrl + '/shards';

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async getConduits(): Promise<Array<TwitchConduit>> {
    const result = await this.axios.get(this.serviceUrl);

    if (result && result.data) {
      return result.data.data;
    }

    return [];
  }

  public async createConduit(
    shardCount: number
  ): Promise<TwitchConduit | null> {
    const result = await this.axios.post(this.serviceUrl, {
      shard_count: shardCount,
    });

    if (result && result.data && result.data.data.length > 0) {
      return result.data.data[0];
    }

    return null;
  }

  public async updateConduit(
    conduitId: string,
    shardCount: number
  ): Promise<TwitchConduit | null> {
    const result = await this.axios.patch(this.serviceUrl, {
      id: conduitId,
      shard_count: shardCount,
    });

    if (result && result.data && result.data.data.length > 0) {
      return result.data.data[0];
    }

    return null;
  }

  public async deleteConduit(conduitId: string): Promise<boolean> {
    await this.axios.delete(`${this.serviceUrl}?id=${conduitId}`);
    return true;
  }

  public async getConduitShards(
    conduitId: string,
    status?: string,
    after?: string
  ): Promise<Array<TwitchConduitShard>> {
    let params = '';
    if (status) {
      params += `&status=${status}`;
    }
    if (after) {
      params += `&after=${after}`;
    }

    const result = await this.axios
      .get(`${this.shardServiceUrl}?conduit_id=${conduitId}${params}`)
      .catch((e) => {
        console.error('Error at : getConduitShards');
        console.error(e);
      });

    if (result && result.data && result.data.data) {
      return result.data.data;
    }

    return [];
  }

  public async updateConduitShards(
    conduitId: string,
    shards: Array<TwitchConduitShard>
  ): Promise<Array<TwitchConduitShard>> {
    const result = await this.axios.patch(this.shardServiceUrl, {
      conduit_id: conduitId,
      shards: shards,
    });

    if (result && result.data && result.data.data) {
      return result.data.data;
    }

    return [];
  }
}
