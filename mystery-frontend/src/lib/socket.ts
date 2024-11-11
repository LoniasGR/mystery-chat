import { io, type Socket } from "socket.io-client";

import { API_BASE_URL } from "./constants";

const socket: Socket<{
  // todo: reuse type also on BE and here not inline type
  typing: (username: string) => void;
  stopTyping: (username: string) => void;
}> = io(API_BASE_URL, { autoConnect: false });

export default socket;
