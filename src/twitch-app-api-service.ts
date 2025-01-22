import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import axiosRetry from "axios-retry";

import TwitchConduitsApiService from "./twitch-conduits-api-service";
import TwitchEventsubApiService from "./twitch-eventsub-service";
import TwitchUserApiService from "./twitch-user-api-service";

export class TwitchAppApiService {
  private readonly twitchTokenUrl = "https://id.twitch.tv/oauth2/token";

  private axios: AxiosInstance;

  private twitchClientId: string;
  private twitchSecret: string;

  private accessToken?: string;

  // Services
  public conduits: TwitchConduitsApiService;
  public eventsub: TwitchEventsubApiService;
  public users: TwitchUserApiService;

  constructor(twitchClientId: string, twitchSecret: string) {
    this.twitchClientId = twitchClientId;
    this.twitchSecret = twitchSecret;

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
          await this.getNewAppAccessToken();
        }
      },
    });

    // Init services
    this.conduits = new TwitchConduitsApiService(this.axios);
    this.eventsub = new TwitchEventsubApiService(this.axios);
    this.users = new TwitchUserApiService(this.axios);
  }

  public async init(): Promise<boolean> {
    await this.getNewAppAccessToken();

    return this.accessToken !== undefined;
  }

  public async getNewAppAccessToken() {
    this.accessToken = undefined;

    try {
      const result = await axios.post(this.twitchTokenUrl, {
        client_id: this.twitchClientId,
        client_secret: this.twitchSecret,
        grant_type: "client_credentials",
      });

      this.accessToken = result.data.access_token;
    } catch (e) {
      console.info("[getNewAppAccessToken] Twitch Error");
      console.info(e);
    }
  }

  public async getRequestConfig(): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosRequestConfig<any> | undefined
  > {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Client-Id": this.twitchClientId,
      },
    };
  }
}
