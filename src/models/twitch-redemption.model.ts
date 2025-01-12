export enum TwitchRedemptionStatus {
  CANCELED = 'CANCELED',
  FULFILLED = 'FULFILLED',
  UNFULFILLED = 'UNFULFILLED',
}

export class TwitchRedemption {
  constructor(
    public broadcaster_name: string,
    public broadcaster_login: string,
    public broadcaster_id: string,
    public id: string,
    public user_login: string,
    public user_id: string,
    public user_name: string,
    public user_input: string,
    public status: TwitchRedemptionStatus,
    public redeemed_at: string,
    public reward: {
      id: string;
      title: string;
      prompt: string;
      cost: number;
    }
  ) {}
}

export class TwitchRedemptionEventSub {
  constructor(
    public broadcaster_user_name: string,
    public broadcaster_user_login: string,
    public broadcaster_user_id: string,
    public id: string,
    public user_login: string,
    public user_id: string,
    public user_name: string,
    public user_input: string,
    public status: TwitchRedemptionStatus,
    public redeemed_at: string,
    public reward: {
      id: string;
      title: string;
      prompt: string;
      cost: number;
    }
  ) {}
}
