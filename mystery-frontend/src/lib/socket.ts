import { io, type Socket } from "socket.io-client";

import { API_BASE_URL } from "./constants";

import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/common/types";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  API_BASE_URL,
  { autoConnect: false, withCredentials: true }
);

export default socket;
