import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import axiosRetry from "axios-retry";
import url from "url";

import { ITwitchApiService } from "./interfaces/twitch-api-service.interface";
import { AccessTokenBean } from "./models";
import { UpdateTokenBean } from "./models/update-token-bean.model";
import TwitchChannelApiService from "./twitch-channel-api-service";
import TwitchChatApiService from "./twitch-chat-api-service";
import TwitchEventsubApiService from "./twitch-eventsub-service";
import TwitchModerationApiService from "./twitch-moderation-api-service";
import TwitchRewardApiService from "./twitch-reward-api-service";
import TwitchRewardRedemptionApiService from "./twitch-reward-redemption-api-service";
import TwitchUserApiService from "./twitch-user-api-service";

export class TwitchApiService implements ITwitchApiService {
  private readonly twitchTokenUrl = "https://id.twitch.tv/oauth2/token";

  private axios: AxiosInstance;

  private twitchClientId: string;
  private twitchSecret: string;

  public getTokens: () => Promise<UpdateTokenBean>;

  private refreshTokenCallback:
    | ((newToken: AccessTokenBean) => Promise<void>)
    | null = null;

  // Services
  public rewards: TwitchRewardApiService;
  public rewardRedemptions: TwitchRewardRedemptionApiService;
  public users: TwitchUserApiService;
  public channel: TwitchChannelApiService;
  public eventsub: TwitchEventsubApiService;
  public chat: TwitchChatApiService;
  public moderation: TwitchModerationApiService;

  constructor(
    twitchClientId: string,
    twitchSecret: string,
    getTokens: () => Promise<UpdateTokenBean>,
    refreshTokenCallback:
      | ((newToken: AccessTokenBean) => Promise<void>)
      | null = null
  ) {
    this.twitchClientId = twitchClientId;
    this.twitchSecret = twitchSecret;
    this.getTokens = getTokens;
    this.refreshTokenCallback = refreshTokenCallback;

    this.axios = axios.create();

    this.axios.interceptors.request.use(async (config) => {
      const newConfig = await this.getRequestConfig();

      if (newConfig !== undefined) {
        config.headers = newConfig.headers as AxiosRequestHeaders;
      }

      return config;
    });

    axiosRetry(this.axios, {
      retries: 3,
      retryCondition: (e) => {
        if (e.status === 401) {
          return true;
        }

        console.log(e);

        return false;
      },
      onRetry: async (
        retryCount: number,
        error: AxiosError,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        requestConfig: AxiosRequestConfig
      ) => {
        if (error.status === 401) {
          await this.sendRefreshToken();
        }
      },
    });

    // Init services
    this.rewards = new TwitchRewardApiService(this.axios, this);
    this.rewardRedemptions = new TwitchRewardRedemptionApiService(
      this.axios,
      this
    );
    this.users = new TwitchUserApiService(this.axios);
    this.channel = new TwitchChannelApiService(this.axios, this);
    this.eventsub = new TwitchEventsubApiService(this.axios);
    this.chat = new TwitchChatApiService(this.axios);
    this.moderation = new TwitchModerationApiService(this.axios);
  }

  public static async getTokenScopes(
    accessToken: string
  ): Promise<Array<string>> {
    const result = await axios.get("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    return result.data.scopes;
  }

  private async sendRefreshToken(): Promise<AccessTokenBean | null> {
    const tokens = await this.getTokens();

    if (tokens.accessToken && tokens.refreshToken) {
      const params = new url.URLSearchParams({
        client_id: this.twitchClientId,
        client_secret: this.twitchSecret,
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken,
      });
      const result: AccessTokenBean = (
        await this.axios.post(this.twitchTokenUrl, params.toString())
      ).data;

      if (this.refreshTokenCallback !== null) {
        await this.refreshTokenCallback(result);
      }
      return result;
    }

    return null;
  }

  public async getRequestConfig(): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosRequestConfig<any> | undefined
  > {
    const tokens = await this.getTokens();
    if (!tokens.accessToken || !tokens.refreshToken) {
      return undefined;
    }

    return {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Client-Id": this.twitchClientId,
      },
    };
  }
}
