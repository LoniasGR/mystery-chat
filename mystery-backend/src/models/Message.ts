export interface Message {
  // todo: centralize the types for FE in BE
  _id: string;
  timestamp: string; // todo: string or Date?
  content: string;
  user: {
    nickname: string;
    avatar?: string;
  };
}
