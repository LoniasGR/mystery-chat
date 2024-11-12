import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { client, connectOrExit, envOrDefault, morgan } from "./src/configs";
import { authController } from "./src/controllers";
import { users } from "./src/data/users.json";
import { UserService } from "./src/services/UserService";
import { fetchMockedMessages } from "./temp_mock";
import type { Message } from "./src/models/Message";

const corsConfig = {
  origin: envOrDefault("CORS_ALLOWED_ORIGINS") as string,
  credentials: true,
};

// Set up the servers
const app = express();
const server = createServer(app);
// todo: type the SocketIO server: https://socket.io/docs/v4/typescript/
const io = new Server(server, {
  cors: corsConfig,
});

// Set up CORS
app.use(cors(corsConfig));

// Set up middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan);

const frontendPath: string = envOrDefault("FRONTEND_DIST_PATH", "") as string;

if (frontendPath.length > 0) {
  app.use(express.static(path.join(__dirname, frontendPath)));
}

// Ensure connection to DB
await connectOrExit(client);
await client.connect();

// Run any startup code
await UserService.createUsers(users);

// Set up endpoints
app.use("/auth", authController);

// todo: move to some other file i guess? should it be a controller?
io.on("connection", async (socket) => {
  let connectedUsername: string = "";

  socket.on("user:init", (username) => {
    console.log(`${username} initialized chat`);
    connectedUsername = username;
  });

  socket.on("messages:send", (msg) => {
    const _msg = msg as Message; // todo: remove when types are in place
    _msg.timestamp = new Date().toISOString(); // update the timestamp with the server time of message receival
    // TODO: store message in DB
    // TODO: retrieve user avatar from DB
    console.log(`${connectedUsername} sent a message: ${_msg.content}`);
    socket.broadcast.emit("messages:receive", _msg);
  });

  socket.on(
    "messages:fetch",
    async (oldestMessage?: string, clientChatId?: string) => {
      const messages = await fetchMockedMessages(oldestMessage);

      socket.emit("messages:history", messages, clientChatId);
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

const port = envOrDefault("APP_PORT");
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
