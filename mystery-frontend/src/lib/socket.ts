import { io, type Socket } from "socket.io-client";

import { API_BASE_URL } from "./constants";

import type { Message } from "@/types";

// todo: reuse type also on BE and here not inline type - also this has all the events, should be split into client, server and common events
const socket: Socket<{
  "typing:start": (username: string) => void;
  "typing:stop": (username: string) => void;
  "user:init": (username: string) => void;
  "user:disconnect": (username: string) => void;
  "messages:send": (message: Message) => void;
  "messages:receive": (message: Message) => void;
  "messages:fetch": (
    oldestMessage?: string, // todo: timestamp or ID?
    chatId?: string
  ) => Promise<Message[]>;
  "messages:history": (messages: Message[], chatId?: string) => void;
}> = io(API_BASE_URL, { autoConnect: false });

export default socket;
