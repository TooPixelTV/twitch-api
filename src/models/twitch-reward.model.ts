export class TwitchReward {
  constructor(
    public broadcaster_name: string,
    public broadcaster_login: string,
    public broadcaster_id: string,
    public id: string,
    public image: string,
    public background_color: string,
    public is_enabled: boolean,
    public cost: number,
    public title: string,
    public prompt: string,
    public is_user_input_required: boolean,
    public max_per_stream_setting: {
      is_enabled: boolean;
      max_per_stream: number;
    },
    public max_per_user_per_stream_setting: {
      is_enabled: boolean;
      max_per_user_per_stream: number;
    },
    public global_cooldown_setting: {
      is_enabled: boolean;
      global_cooldown_seconds: number;
    },
    public is_paused: boolean,
    public is_in_stock: boolean,
    public default_image: {
      url_1x: string;
      url_2x: string;
      url_4x: string;
    },
    public should_redemptions_skip_request_queue: boolean,
    public redemptions_redeemed_current_stream: number | null,
    public cooldown_expires_at: number | null
  ) {}
}
