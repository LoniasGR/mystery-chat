import type { User } from "./user";

export type Message = {
  _id: string;
  user: User;
  content: string;
  timestamp: string;
};
