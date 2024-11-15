import { Server, Socket } from "socket.io";
import type { Message } from "@/models/Message";
import MessageRepository from "@/repositories/messageRepository";
import UserRepository from "@/repositories/userRepository";

import type { MessageCallbackParams } from "@/common/types";

type ConnectionInfo = {
  io: Server;
  socket: Socket;
  connectedUsername: string;
};

interface serverToClientEvents {
  "user:init": (username: string) => void;
  "messages:send": (msg: Message) => void;
  "messages:fetch": (
    oldestMessageTimestamp: string | undefined,
    callback: (data: MessageCallbackParams) => void
  ) => void;
  "typing:start": (username: string) => void;
  "typing:stop": (username: string) => void;
}

export default function createSocketRoutes(io: Server) {
  io.on("connection", async (socket: Socket) => {
    const connectedUsername = socket.request.username!;
    const connectionInfo = { io, socket, connectedUsername };

    socket.on("user:init", (username) => initUser(connectionInfo, username));

    socket.on("messages:send", async (msg: Message) =>
      handleMessageReceival(connectionInfo, msg)
    );

    socket.on(
      "messages:fetch",
      async (
        oldestMessageTimestamp: string | undefined,
        callback: (data: MessageCallbackParams) => void
      ) => {
        try {
          const messages = await listMessages(oldestMessageTimestamp);
          callback({
            status: "OK",
            data: messages,
          });
        } catch (err) {
          callback({
            status: "ERROR",
            error: err,
          });
        }
      }
    );

    socket.on("typing:start", (username) => {
      console.log(`${username} is typing...`);
      socket.broadcast.emit("typing:start", username);
    });

    socket.on("typing:stop", (username) => {
      console.log(`${username} is not typing...`);
      socket.broadcast.emit("typing:stop", username);
    });

    socket.on("disconnect", () => {
      console.log(`${connectedUsername} disconnected`);
      io.emit("user:disconnect", connectedUsername);
    });
  });
}

function initUser({ connectedUsername }: ConnectionInfo, username: string) {
  connectedUsername = username;
  console.debug(`${connectedUsername} initialized chat`);
}

async function handleMessageReceival(
  { socket, connectedUsername }: ConnectionInfo,
  msg: Message
) {
  const _msg = msg; // todo: remove when types are in place
  _msg.timestamp = new Date().toISOString(); // update the timestamp with the server time of message receival

  // Get avatar of user
  const user = await UserRepository.findById(_msg.user._id);
  _msg.user.avatar = user?.avatar;

  // Store message
  MessageRepository.create(_msg);
  console.log(`${connectedUsername} sent a message: ${_msg.content}`);
  socket.broadcast.emit("messages:receive", _msg);
}

async function listMessages(oldestMessageTimestampString?: string) {
  // We set the oldest message timestamp to the current time
  let oldestMessageTimestamp;
  if (!oldestMessageTimestampString) {
    oldestMessageTimestamp = new Date();
  } else {
    oldestMessageTimestamp = new Date(oldestMessageTimestampString);
  }
  return await MessageRepository.findManyOlderThan(oldestMessageTimestamp);
}
