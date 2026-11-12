export interface ITwitchStreamsApiService {
  /**
   * Returns the ids of the users currently live among the given ids.
   * Requests are split by batches of 100 ids (Twitch limit).
   */
  getLiveUserIds(userIds: Array<string>): Promise<Array<string>>;
}
