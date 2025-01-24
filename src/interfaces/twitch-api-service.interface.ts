import { ITwitchChannelApiService } from "./twitch-channel-api-service.interface";
import { ITwitchChatApiService } from "./twitch-chat-api-service.interface";
import { ITwitchEventsubApiService } from "./twitch-eventsub-service.interface";
import { ITwitchModerationApiService } from "./twitch-moderation-api-service.interface";
import { ITwitchRewardApiService } from "./twitch-reward-api-service.interface";
import { ITwitchRewardRedemptionApiService } from "./twitch-reward-redemption-api-service.interface";
import { ITwitchUserApiService } from "./twitch-user-api-service.interface";

export interface ITwitchApiService {
  // Services
  rewards: ITwitchRewardApiService;
  rewardRedemptions: ITwitchRewardRedemptionApiService;
  users: ITwitchUserApiService;
  channel: ITwitchChannelApiService;
  eventsub: ITwitchEventsubApiService;
  chat: ITwitchChatApiService;
  moderation: ITwitchModerationApiService;
}
