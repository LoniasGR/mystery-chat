import { Server, Socket, type DefaultEventsMap } from "socket.io";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@/common/types";

export type MessageServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;

export type MessageSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;
