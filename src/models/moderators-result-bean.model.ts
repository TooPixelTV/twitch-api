import { TwitchSimpleUser } from "./twitch-user.model";

export interface ModeratorsResultBean {
  data: Array<TwitchSimpleUser>;
  pagination?: {
    cursor?: string;
  };
}
