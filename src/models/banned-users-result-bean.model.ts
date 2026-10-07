import { TwitchBannedUserBean } from "./twitch-banned-user-bean.model";

export interface BannedUsersResultBean {
  data: Array<TwitchBannedUserBean>;
  pagination?: {
    cursor?: string;
  };
}
