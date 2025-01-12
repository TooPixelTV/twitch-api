import { AxiosInstance, AxiosResponse } from 'axios';

import { ITwitchChatApiService } from './interfaces/twitch-chat-api-service.interface';
import { SentMessageBean } from './models';
import { TwitchChatter } from './models/twitch-chatter.model';

export default class TwitchChatApiService implements ITwitchChatApiService {
  private chattersUrl = "https://api.twitch.tv/helix/chat/chatters";
  private messagesUrl = "https://api.twitch.tv/helix/chat/messages";

  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async getChatters(requestData: {
    twitchUserId: string;
  }): Promise<Array<TwitchChatter>> {
    const result: Array<TwitchChatter> = [];

    let continueRequest = false;
    let cursor = null;
    do {
      const response: AxiosResponse<any, any> = await this.axios.get(
        `${this.chattersUrl}?broadcaster_id=${
          requestData.twitchUserId
        }&moderator_id=${requestData.twitchUserId}${
          cursor !== null ? "&after=" + cursor : ""
        }`
      );

      if (response.data) {
        if (response.data.data.length > 0) {
          result.push(...response.data.data);
        }

        if (response.data.pagination && response.data.pagination.cursor) {
          continueRequest = true;
          cursor = response.data.pagination.cursor;
        }
      }
    } while (continueRequest);

    return result;
  }

  async sendMessage(requestData: {
    broadcaster_id: string;
    sender_id: string;
    message: string;
    reply_parent_message_id?: string;
  }): Promise<SentMessageBean | null> {
    const response = await this.axios.post(`${this.messagesUrl}`, requestData);

    if (response) {
      return response.data.data[0];
    }

    return null;
  }
}
