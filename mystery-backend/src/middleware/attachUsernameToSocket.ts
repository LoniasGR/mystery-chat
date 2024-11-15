import type { ExtendedError } from "socket.io";
import type { MessageSocket } from "@/types/socket";

export function attachUsernameToSocket(
  socket: MessageSocket,
  next: (err?: ExtendedError) => void
) {
  console.log("ewqewqewq");
  socket.data.username = socket.handshake.query.username as string;
  next();
}
