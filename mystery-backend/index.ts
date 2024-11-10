import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { client, connectOrExit, envOrDefault, morgan } from "./src/configs";
import { authController, userController } from "./src/controllers";
import { users } from "./src/data/users.json";
import { UserService } from "./src/services/UserService";

// Set up the servers
const app = express();
const server = createServer(app);
const io = new Server(server);

// Set up CORS
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}

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
app.use("/users", userController);
app.use("/auth", authController);

io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = envOrDefault("APP_PORT");
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
