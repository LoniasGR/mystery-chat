import { client, connectOrExit, envOrDefault, morgan } from "@/configs";
import { authController } from "@/controllers";
import createSocketRoutes from "@/controllers/SocketController";
import { attachUsernameToSocket } from "@/middleware/attachUsernameToSocket";
import { ensureValidJWT } from "@/middleware/ensureValidJWT";
import { User } from "@/models/User";
import { UserService } from "@/services/UserService";
import type { MessageServer } from "@/types/socket";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";

const corsConfig = {
  origin: envOrDefault<string>("CORS_ALLOWED_ORIGINS"),
  credentials: true,
};

// Set up the servers
const app = express();
const server = createServer(app);

const io: MessageServer = new Server(server, {
  serveClient: false,
  cors: corsConfig,
});

// Set up express middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(morgan);

// Set up Socket.io middleware
io.engine.use(cookieParser());
io.engine.use(ensureValidJWT);
io.use(attachUsernameToSocket);

const frontendPath = envOrDefault<string>("FRONTEND_DIST_PATH", "");
if (frontendPath.length > 0) {
  app.use(express.static(path.join(__dirname, frontendPath)));
}

// Ensure connection to DB
await connectOrExit(client);
await client.connect();

// Run any startup code
const file = Bun.file("./src/data/users.json");
if (await file.exists()) {
  const data = (await file.json()) as { users: User[] };
  await UserService.createUsers(data.users);
}
// Set up HTTP endpoints
app.use("/auth", authController);

// Set up Socket.io connections
createSocketRoutes(io);

// Start HTTP server
const port = envOrDefault<string>("APP_PORT");
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
