import { TwitchSimpleUser } from "./twitch-user.model";

export interface UsersResultBean {
  data: Array<TwitchSimpleUser>;
  pagination?: {
    cursor?: string;
  };
}
