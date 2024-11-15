import { Server, Socket } from "socket.io";
import type { Message } from "@/models/Message";
import MessageRepository from "@/repositories/messageRepository";
import UserRepository from "@/repositories/userRepository";
import type { MessageServer } from "@/types/socket";

type ConnectionInfo = {
  io: Server;
  socket: Socket;
  connectedUsername: string;
};

export default function createSocketRoutes(io: MessageServer) {
  io.on("connection", async (socket) => {
    const connectedUsername = socket.request.username!;
    console.log({ x: socket.request.username, d: socket.data });
    const connectionInfo = { io, socket, connectedUsername };

    socket.on("messages:send", async (msg) =>
      handleMessageReceival(connectionInfo, msg)
    );

    socket.on(
      "messages:fetch",
      async (oldestMessageTimestamp, chatId, callback) => {
        try {
          const messages = await listMessages(oldestMessageTimestamp);
          callback(
            {
              status: "OK",
              data: messages,
            },
            chatId
          );
        } catch (err) {
          callback(
            {
              status: "ERROR",
              error: err instanceof Error ? err.message : String(err),
            },
            chatId
          );
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

async function handleMessageReceival(
  { socket, connectedUsername }: ConnectionInfo,
  msg: Message
) {
  msg.timestamp = new Date().toISOString(); // update the timestamp with the server time of message receival

  // Get avatar of user
  const user = await UserRepository.findById(msg.user._id);
  msg.user.avatar = user?.avatar;

  // Store message
  MessageRepository.create(msg);
  console.log(`${connectedUsername} sent a message: ${msg.content}`);
  socket.broadcast.emit("messages:receive", msg);
}

async function listMessages(oldestMessageTimestampString: string | null) {
  // We set the oldest message timestamp to the current time
  let oldestMessageTimestamp;
  if (!oldestMessageTimestampString) {
    oldestMessageTimestamp = new Date();
  } else {
    oldestMessageTimestamp = new Date(oldestMessageTimestampString);
  }
  return await MessageRepository.findManyOlderThan(oldestMessageTimestamp);
}
