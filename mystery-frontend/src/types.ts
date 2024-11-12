export type Message = {
  _id: string;
  user: User;
  content: string;
  timestamp: string;
};

export type User = {
  nickname: string;
  avatar?: string;
};
