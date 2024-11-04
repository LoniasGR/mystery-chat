export interface Message {
  id?: string;
  timestamp: Date;
  content: string;
  user: {
    username: string;
    avatar: string;
  };
}
