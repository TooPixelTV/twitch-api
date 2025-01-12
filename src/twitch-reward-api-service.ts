import { AxiosInstance } from 'axios';

import { ITwitchRewardApiService } from './interfaces/twitch-reward-api-service.interface';
import { TwitchReward } from './models';
import { TwitchApiService } from './twitch-api-service';

export default class TwitchRewardApiService implements ITwitchRewardApiService {
  private serviceUrl =
    'https://api.twitch.tv/helix/channel_points/custom_rewards';

  private axios: AxiosInstance;
  private twitchApiService: TwitchApiService;

  constructor(axios: AxiosInstance, twitchApiService: TwitchApiService) {
    this.axios = axios;
    this.twitchApiService = twitchApiService;
  }

  public async createReward(requestData: {
    title: string;
    cost: number;
    prompt?: string;
    is_user_input_required?: boolean;
    should_redemptions_skip_request_queue?: boolean;
  }): Promise<TwitchReward | null> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    if (broadcasterUser) {
      const result = await this.axios.post(
        `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}`,
        {
          title: requestData.title,
          cost: requestData.cost,
          prompt: requestData.prompt ? requestData.prompt : '',
          is_user_input_required: requestData.is_user_input_required
            ? requestData.is_user_input_required
            : false,
          should_redemptions_skip_request_queue:
            requestData.should_redemptions_skip_request_queue
              ? requestData.should_redemptions_skip_request_queue
              : false,
        }
      );

      return result.data.data[0];
    }
    return null;
  }

  public async deleteReward(requestData: {
    rewardId: string;
    broadcaster_id?: string | null;
  }) {
    if (!requestData.broadcaster_id) {
      const broadcaster =
        await this.twitchApiService.users.getCurrentUserInfos();
      if (broadcaster) {
        requestData.broadcaster_id = broadcaster.id;
      }
    }

    if (requestData.broadcaster_id) {
      await this.axios.delete(
        `${this.serviceUrl}?broadcaster_id=${requestData.broadcaster_id}&id=${requestData.rewardId}`
      );
    }
  }

  public async getRewards(requestData: {
    only_manageable_rewards?: boolean;
  }): Promise<Array<TwitchReward>> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    if (requestData.only_manageable_rewards === undefined) {
      requestData.only_manageable_rewards = false;
    }

    if (broadcasterUser) {
      const result = await this.axios.get(
        `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&only_manageable_rewards=${requestData.only_manageable_rewards}`
      );
      return result.data.data;
    }
    return [];
  }

  public async updateRewardCost(requestData: {
    rewardId: string;
    cost: number;
  }): Promise<TwitchReward | null> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    if (broadcasterUser) {
      const result = await this.axios.patch(
        `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&id=${requestData.rewardId}`,
        {
          cost: requestData.cost,
        }
      );

      return result.data.data[0];
    }
    return null;
  }

  public async updateRewardDescription(requestData: {
    rewardId: string;
    description: string;
  }): Promise<TwitchReward | null> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    if (broadcasterUser) {
      const result = await this.axios.patch(
        `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&id=${requestData.rewardId}`,
        {
          prompt: requestData.description,
        }
      );

      return result.data.data[0];
    }
    return null;
  }

  public async updateRewardNeedUserInput(requestData: {
    rewardId: string;
    needUserInput: boolean;
  }): Promise<TwitchReward | null> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    if (broadcasterUser) {
      const result = await this.axios.patch(
        `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&id=${requestData.rewardId}`,
        {
          is_user_input_required: requestData.needUserInput,
        }
      );

      return result.data.data[0];
    }
    return null;
  }

  public async enableReward(requestData: {
    rewardId: string;
    value: boolean;
  }): Promise<TwitchReward | null> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    if (broadcasterUser) {
      const result = await this.axios.patch(
        `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&id=${requestData.rewardId}`,
        {
          is_enabled: requestData.value,
        }
      );

      return result.data.data[0];
    }
    return null;
  }
}
