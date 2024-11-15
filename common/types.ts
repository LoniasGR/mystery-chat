export type Message = {
  _id: string;
  user: User;
  content: string;
  timestamp: string;
};

export type User = {
  _id: string;
  avatar?: string;
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export type MessageCallbackParams = CallbackParams<Message[]>;

export type CallbackParams<T = unknown> =
  | {
      status: "OK";
      data: T;
    }
  | {
      status: "ERROR";
      error: unknown;
    };
