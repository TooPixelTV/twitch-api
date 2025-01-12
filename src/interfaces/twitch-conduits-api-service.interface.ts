import { TwitchConduit, TwitchConduitShard } from '../models';

export interface ITwitchConduitsApiService {
  getConduits(): Promise<Array<TwitchConduit>>;
  createConduit(shardCount: number): Promise<TwitchConduit | null>;
  updateConduit(
    conduitId: string,
    shardCount: number
  ): Promise<TwitchConduit | null>;
  deleteConduit(conduitId: string): Promise<boolean>;
  getConduitShards(
    conduitId: string,
    status?: string,
    after?: string
  ): Promise<Array<TwitchConduitShard>>;
  updateConduitShards(
    conduitId: string,
    shards: Array<TwitchConduitShard>
  ): Promise<Array<TwitchConduitShard>>;
}
