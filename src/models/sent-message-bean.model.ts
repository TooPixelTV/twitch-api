export interface SentMessageBean {
  message_id: string;
  is_sent: boolean;
  drop_reason?: {
    code: string;
    message: string;
  };
}
