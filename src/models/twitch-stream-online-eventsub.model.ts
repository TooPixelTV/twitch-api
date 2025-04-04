export class TwitchStreamOnlineEventSub {
  constructor(
    public id: string,
    public broadcaster_user_id: string,
    public broadcaster_user_login: string,
    public broadcaster_user_name: string,
    public type: "live" | "playlist" | "watch_party" | "premiere" | "rerun",
    public started_at: string
  ) {}
}
