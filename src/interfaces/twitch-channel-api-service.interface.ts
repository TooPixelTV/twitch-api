import { FollowerBean } from '../models/follower-bean.model';

export interface ITwitchChannelApiService {
  isLive(requestData: { channel: string }): Promise<boolean>;
  getAllFollowers(): Promise<Array<FollowerBean>>;
}
