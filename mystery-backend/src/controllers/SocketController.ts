import { Server, Socket } from "socket.io";
import type { Message } from "@/models/Message";
import MessageRepository from "@/repositories/messageRepository";
import UserRepository from "@/repositories/userRepository";
import type { MessageServer } from "@/types/socket";
import type { BareMessage } from "@/common/types";

type ConnectionInfo = {
  io: Server;
  socket: Socket;
  connectedUsername: string;
};

export default function createSocketRoutes(io: MessageServer) {
  io.on("connection", async (socket) => {
    const username = socket.data.username;
    const connectionInfo = {
      io,
      socket,
      connectedUsername: socket.data.username!,
    };

    socket.on("messages:send", (msg) =>
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

    socket.on("typing:start", () => {
      console.log(`${username} is typing...`);
      socket.broadcast.emit("typing:start", username);
    });

    socket.on("typing:stop", () => {
      console.log(`${username} is not typing...`);
      socket.broadcast.emit("typing:stop", username);
    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected`);
      io.emit("user:disconnect", username);
    });
  });
}

async function handleMessageReceival(
  { socket, connectedUsername }: ConnectionInfo,
  msg: BareMessage
) {
  const broadcastedMsg = msg as Message;
  broadcastedMsg.timestamp = new Date().toISOString(); // update the timestamp with the server time of message receival

  // Get avatar of user
  const user = await UserRepository.findById(connectedUsername);

  if (user) {
    broadcastedMsg.user = {
      _id: user._id,
      avatar: user.avatar,
    };
  }

  // Store message
  MessageRepository.create(broadcastedMsg);
  console.log(`${connectedUsername} sent a message: ${broadcastedMsg.content}`);
  socket.broadcast.emit("messages:receive", broadcastedMsg);
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
