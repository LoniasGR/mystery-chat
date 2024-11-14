import { io, type Socket } from "socket.io-client";

import { API_BASE_URL } from "./constants";

import type { Message } from "@/types";

export type callbackParams = {
  status: "OK" | "ERROR";
  error?: unknown;
  messages?: Message[];
};

// todo: reuse type also on BE and here not inline type - also this has all the events, should be split into client, server and common events
const socket: Socket<{
  "typing:start": (username: string) => void;
  "typing:stop": (username: string) => void;
  "user:init": (username: string) => void;
  "user:disconnect": (username: string) => void;
  "messages:send": (message: Message) => void;
  "messages:receive": (message: Message) => void;
  "messages:fetch": (
    oldestMessage: string | null, // todo: timestamp or ID?
    callback: (data: callbackParams) => void
  ) => Promise<Message[]>;
  "messages:history": (messages: Message[], chatId?: string) => void;
}> = io(API_BASE_URL, { autoConnect: false, withCredentials: true });

export default socket;
