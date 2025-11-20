import { TwitchReward } from "../models";

export interface ITwitchRewardApiService {
  createReward(requestData: {
    title: string;
    cost: number;
    prompt: string;
    is_user_input_required: boolean;
    should_redemptions_skip_request_queue: boolean;
  }): Promise<TwitchReward | null>;
  deleteReward(requestData: {
    rewardId: string;
    broadcaster_id: string | null;
  }): Promise<void>;
  getRewards(requestData: {
    only_manageable_rewards: boolean;
  }): Promise<Array<TwitchReward>>;
  updateRewardCost(requestData: {
    rewardId: string;
    cost: number;
  }): Promise<TwitchReward | null>;
  updateRewardName(requestData: {
    rewardId: string;
    name: string;
  }): Promise<TwitchReward | null>;
  updateRewardDescription(requestData: {
    rewardId: string;
    description: string;
  }): Promise<TwitchReward | null>;
  updateRewardNeedUserInput(requestData: {
    rewardId: string;
    needUserInput: boolean;
  }): Promise<TwitchReward | null>;
  enableReward(requestData: {
    rewardId: string;
    value: boolean;
  }): Promise<TwitchReward | null>;
}
