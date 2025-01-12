export interface TwitchEventsubTransport {
  method: 'webhook' | 'websocket' | 'conduit';
  callback?: string;
  secret?: string;
  session_id?: string;
  conduit_id?: string;
  connected_at?: string;
  disconnected_at?: string;
}
