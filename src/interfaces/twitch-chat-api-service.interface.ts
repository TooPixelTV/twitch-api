import { SentMessageBean } from "../models/sent-message-bean.model";
import { TwitchChatter } from "../models/twitch-chatter.model";

export interface ITwitchChatApiService {
  getChatters(requestData: {
    twitchUserId: string;
  }): Promise<Array<TwitchChatter>>;
  sendMessage(requestData: {
    broadcaster_id: string;
    sender_id: string;
    message: string;
    reply_parent_message_id?: string;
  }): Promise<SentMessageBean | null>;
  deleteMessage(requestData: {
    broadcaster_id: string;
    moderator_id: string;
    message_id?: string;
  }): Promise<boolean>;
}
