export class TwitchUser {
  constructor(
    public id: string,
    public login: string,
    public display_name: string,
    public type: string,
    public broadcaster_type: string,
    public description: string,
    public profile_image_url: string,
    public offline_image_url: string,
    public view_count: number,
    public created_at: string
  ) {}
}
