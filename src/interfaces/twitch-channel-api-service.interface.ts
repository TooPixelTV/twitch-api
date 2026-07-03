import { TwitchSimpleUser, UsersResultBean } from 'src/models';
import { FollowerBean } from '../models/follower-bean.model';

export interface ITwitchChannelApiService {
  isLive(requestData: { channel: string }): Promise<boolean>;
  getAllFollowers(): Promise<Array<FollowerBean>>;
  getAllVips(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<Array<TwitchSimpleUser>>;
  getVips(requestData: {
    broadcaster_id: string;
    user_id?: string;
    first?: string;
    after?: string;
  }): Promise<UsersResultBean | null>;
}
