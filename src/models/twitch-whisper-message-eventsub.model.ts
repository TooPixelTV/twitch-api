export class TwitchWhisperMessageEventSub {
  constructor(
    public from_user_id: string,
    public from_user_login: string,
    public from_user_name: string,
    public to_user_id: string,
    public to_user_login: string,
    public to_user_name: string,
    public whisper_id: string,
    public whisper: { text: string }
  ) {}
}
