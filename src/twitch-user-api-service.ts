import { AxiosInstance } from 'axios';

import { ITwitchUserApiService } from './interfaces/twitch-user-api-service.interface';
import { TwitchUser } from './models';
import { TwitchApiService } from './twitch-api-service';

export default class TwitchUserApiService implements ITwitchUserApiService {
  private serviceUrl = 'https://api.twitch.tv/helix/users';

  private axios: AxiosInstance;
  private twitchApiService: TwitchApiService;

  constructor(axios: AxiosInstance, twitchApiService: TwitchApiService) {
    this.axios = axios;
    this.twitchApiService = twitchApiService;
  }

  public async getCurrentUserInfos(): Promise<TwitchUser | null> {
    const result = await this.axios.get(this.serviceUrl);

    return result.data.data[0];
  }

  public async getUserInfos(requestData: {
    userId: string;
  }): Promise<TwitchUser | null> {
    const result = await this.axios.get(
      this.serviceUrl + `?id=${requestData.userId}`
    );

    return result.data.data.length > 0 ? result.data.data[0] : null;
  }

  public async getMultipleUserInfos(requestData: {
    userIds: Array<string>;
  }): Promise<Array<TwitchUser>> {
    const result: Array<TwitchUser> = [];

    while (requestData.userIds.length > 0) {
      const usersList: Array<string> = requestData.userIds.splice(0, 100);
      const usersUrl = usersList.map((u) => `id=${u}`).join('&');

      const callResult = await this.axios.get(this.serviceUrl + `?${usersUrl}`);

      if (callResult.data && callResult.data.data) {
        result.push(...callResult.data.data);
      }
    }

    return result;
  }
}
