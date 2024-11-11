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

const corsConfig = {
  origin: envOrDefault("CORS_ALLOWED_ORIGINS") as string,
  credentials: true,
};

// Set up the servers
const app = express();
const server = createServer(app);
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

// todo: move to some other file i guess?
io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("typing", (username) => {
    console.log(`${username} is typing...`);
    io.emit("typing", username);
    // TODO: Use socket.broadcast.emit when you want to send a message to every client except the one that triggered the event.
  });

  socket.on("stopTyping", (username) => {
    console.log(`${username} is not typing...`);
    io.emit("stopTyping", username);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = envOrDefault("APP_PORT");
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
