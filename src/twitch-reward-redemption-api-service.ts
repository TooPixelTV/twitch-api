import { AxiosInstance } from 'axios';

import { ITwitchRewardRedemptionApiService } from './interfaces/twitch-reward-redemption-api-service.interface';
import { TwitchRedemption, TwitchRedemptionStatus } from './models';
import { TwitchApiService } from './twitch-api-service';

export default class TwitchRewardRedemptionApiService
  implements ITwitchRewardRedemptionApiService
{
  private serviceUrl =
    'https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions';

  private axios: AxiosInstance;
  private twitchApiService: TwitchApiService;

  constructor(axios: AxiosInstance, twitchApiService: TwitchApiService) {
    this.axios = axios;
    this.twitchApiService = twitchApiService;
  }

  public async getUnfulfilledRedemptions(): Promise<Array<TwitchRedemption>> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    const rewards = await this.twitchApiService.rewards.getRewards({
      only_manageable_rewards: true,
    });

    const allRedemptions: Array<TwitchRedemption> = [];

    if (broadcasterUser) {
      for (let i = 0; i < rewards.length; i++) {
        const reward = rewards[i];
        const result = await this.axios.get(
          `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&reward_id=${reward.id}&status=UNFULFILLED`
        );

        allRedemptions.push(...(result.data.data as Array<TwitchRedemption>));
      }
    }

    return allRedemptions;
  }

  public async updateRedemption(requestData: {
    rewardId: string;
    redemptionId: string;
    status: TwitchRedemptionStatus;
  }): Promise<void> {
    const broadcasterUser =
      await this.twitchApiService.users.getCurrentUserInfos();

    try {
      if (broadcasterUser) {
        await this.axios.patch(
          `${this.serviceUrl}?broadcaster_id=${broadcasterUser.id}&reward_id=${requestData.rewardId}&id=${requestData.redemptionId}`,
          { status: requestData.status }
        );
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any).status !== 404) {
        console.error('Error on : updateRedemption');
        console.error('With parameters :');
        console.info('rewardId', requestData.rewardId);
        console.info('redemptionId', requestData.redemptionId);
        console.info('status', requestData.status);
        console.error(e);
      }
    }
  }
}
