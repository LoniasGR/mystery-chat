import type { Message } from "./message";
import type { User } from "./user";

// todo: maybe remove user:init and other places (at least args) where we pass username instead of reading it from a cookie
// todo: maybe a need to introduce a BareMessage type that doesn't have user field

export type ServerToClientEvents = {
  "user:disconnect": (username: string) => void;
  "messages:receive": (message: Message) => void;
  "typing:start": (username: User["_id"]) => void;
  "typing:stop": (username: User["_id"]) => void;
};

export type ClientToServerEvents = {
  "user:init": (username: User["_id"]) => void;
  "typing:start": (username: User["_id"]) => void;
  "typing:stop": (username: User["_id"]) => void;
  "messages:send": (message: Message) => void;
  "messages:fetch": (
    oldestMessage: string | null,
    callback: (data: MessageCallbackParams) => void
  ) => Promise<void>; // todo: Promise here or in the callback?
};

export type SocketData = {
  username: User["_id"] | undefined;
};

export type MessageCallbackParams = CallbackParams<Message[]>;

type CallbackParams<T = unknown> =
  | {
      status: "OK";
      data: T;
    }
  | {
      status: "ERROR";
      error: unknown;
    };
