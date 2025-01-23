export class TwitchChatMessageEventSub {
  constructor(
    public broadcaster_user_name: string,
    public broadcaster_user_login: string,
    public broadcaster_user_id: string,
    public source_broadcaster_user_id: string | null,
    public source_broadcaster_user_login: string | null,
    public source_broadcaster_user_name: string | null,
    public chatter_user_id: string,
    public chatter_user_login: string,
    public chatter_user_name: string,
    public message_id: string,
    public source_message_id: string | null,
    public message: {
      text: string;
      fragments: Array<{
        type: string;
        text: string;
        cheermote: null;
        emote: null;
        mention: null;
      }>;
    },
    public color: string,
    public badges: Array<{
      set_id: string;
      id: string;
      info: string;
    }>,
    public source_badges: string | null,
    public message_type: string,
    public cheer: null,
    public reply: null,
    public channel_points_custom_reward_id: null,
    public channel_points_animation_id: null
  ) {}
}
