import { TwitchEventsubTransport } from './twitch-eventsub-transport.model';

export interface TwitchConduitShard {
  id: string;
  transport: TwitchEventsubTransport;
  status?: string;
  pagination?: {
    cursor?: string;
  };
}
