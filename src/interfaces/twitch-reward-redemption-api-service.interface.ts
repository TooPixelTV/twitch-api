import { TwitchRedemption, TwitchRedemptionStatus } from '../models';

export interface ITwitchRewardRedemptionApiService {
  getUnfulfilledRedemptions(): Promise<Array<TwitchRedemption>>;
  updateRedemption(requestData: {
    rewardId: string;
    redemptionId: string;
    status: TwitchRedemptionStatus;
  }): Promise<void>;
}
