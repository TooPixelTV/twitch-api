import { TwitchEventsubTransport } from './twitch-eventsub-transport.model';

export interface TwitchSubscription {
  id: string;
  status: string;
  type: string;
  version: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any;
  created_at: string;
  transport: TwitchEventsubTransport;
  cost: number;
}
