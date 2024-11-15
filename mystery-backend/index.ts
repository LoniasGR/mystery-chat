import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { client, connectOrExit, envOrDefault, morgan } from "@/configs";
import { authController } from "@/controllers";
import { users } from "@/data/users.json";
import { UserService } from "@/services/UserService";
import { ensureValidJWT } from "@/middleware/ensureValidJWT";
import createSocketRoutes, {
  type MessageServer,
} from "@/controllers/SocketController";

const corsConfig = {
  origin: envOrDefault("CORS_ALLOWED_ORIGINS") as string,
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

const frontendPath: string = envOrDefault("FRONTEND_DIST_PATH", "") as string;
if (frontendPath.length > 0) {
  app.use(express.static(path.join(__dirname, frontendPath)));
}

// Ensure connection to DB
await connectOrExit(client);
await client.connect();

// Run any startup code
await UserService.createUsers(users);

// Set up HTTP endpoints
app.use("/auth", authController);

// Set up Socket.io connections
createSocketRoutes(io);

// Start HTTP server
const port = envOrDefault("APP_PORT");
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
