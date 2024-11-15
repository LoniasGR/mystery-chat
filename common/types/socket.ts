import type { BareMessage, Message } from "./message";
import type { User } from "./user";

export type ServerToClientEvents = {
  "user:disconnect": (username: string) => void;
  "messages:receive": (message: Message) => void;
  "typing:start": (username: User["_id"]) => void;
  "typing:stop": (username: User["_id"]) => void;
};

export type ClientToServerEvents = {
  "typing:start": () => void;
  "typing:stop": () => void;
  "messages:send": (message: BareMessage) => void;
  "messages:fetch": (
    oldestMessage: string | null,
    chatId: string,
    callback: (data: MessageCallbackParams, chatId?: string) => void
  ) => Promise<void>;
};

export type SocketData = {
  username: User["_id"];
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
