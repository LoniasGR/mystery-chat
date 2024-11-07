import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { client, connectOrExit, envOrDefault, morgan } from "./src/configs";
import { authController, userController } from "./src/controllers";
import { users } from "./src/data/users.json";
import { UserService } from "./src/services/UserService";

// Set up middleware
const app = express();
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

const port = envOrDefault("APP_PORT");
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
