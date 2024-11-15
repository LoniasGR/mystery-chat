import type { User } from "./user";

export type BareMessage = {
  _id: string;
  content: string;
  timestamp: string;
};

export type Message = BareMessage & {
  user: User;
};
